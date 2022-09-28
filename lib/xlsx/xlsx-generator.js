const xlsx = require('excel4node');

/**
 * @class XlsxGenerator
 */
class XlsxGenerator {
  /**
   * @constructor
   * @constructs XlsxGenerator
   */
  constructor() {
    this.workbook = null;
    this.currentSheet = null;
    this.currentCell = null;
    this.currentCellStyle = {};
  }

  /**
   * initNewWorkbook
   * @returns {undefined}
   */
  initNewWorkbook() {
    this.workbook = new xlsx.Workbook({
      defaultFont: {
        size: 10,
        name: 'Calibri',
        color: '000000',
      },
    });
    this.currentSheet = this.workbook.addWorksheet('');
    this.currentCellCoords = [1, 1];
    this.currentCell = this.currentSheet.cell(1, 1);
  }

  /**
   * addNewSheet
   * @param {string} name the name of the new sheet
   * @returns {undefined}
   */
  addNewSheet(name) {
    if (this.workbook.sheets.find(({ name: wbName }) => name === wbName)) {
      throw new Error(`Workbook already has a sheet named '${name}'`);
    }
    this.workbook.addWorksheet(name);
  }

  /**
   * nameCurrentSheet
   * @param {string} name the name of the current sheet
   * @returns {undefined}
   */
  nameCurrentSheet(name) {
    if (this.workbook.sheets.find(({ name: wbName }) => name === wbName)) {
      throw new Error(`Workbook already has a sheet named '${name}'`);
    }
    this.currentSheet.name = name;
  }

  /**
   * setCurrentSheet
   * @param {string} name the name of the sheet you want to select
   * @returns {undefined}
   */
  setCurrentSheet(name) {
    const sheet = this.workbook.sheets.find(({ name: wbName }) => name === wbName);
    if (sheet) this.currentSheet = sheet;
    else throw new Error(`Workbook does not have a sheet named ${name}`);
  }

  /**
   * setSheetCellDimensions
   * @param {Object} params the argument object
   * @param {Object} params.rows object with numeric keys and values
   *                             key = which row, value = height
   * @param {Object} params.columns object with numeric keys and values
   *                                key = which column, value = width
   * @returns {undefined}
   */
  setSheetCellDimensions({ rows, columns }) {
    Object.keys(rows).forEach(i => this.currentSheet.row(+i).height = rows[i]);
    Object.keys(columns).forEach(i => this.currentSheet.column(+i).width = columns[i]);
  }

  /**
   * setCurrentCell
   * @param {number} row the row number
   * @param {number} col the column number
   * @returns {undefined}
   */
  setCurrentCell(row, col) {
    this.currentCellCoords = [row, col];
    this.currentCell = this.currentSheet.cell(row, col);
  }

  /**
   * moveToRelativeCell sets the current cell relative to the current selected cell
   * @param {number} row the number of rows to move over (positive -> down)
   * @param {number} col the number of columns to move over (positive -> right)
   * @returns {undefined}
   */
  moveToRelativeCell(row, col) {
    this.setCurrentCell(this.currentCellCoords[0] + row, this.currentCellCoords[1] + col);
  }

  /**
   * getCellStyle transforms simplified style object for excel4node
   * @param {Object} style the cell styles
   * @param {string} syle.fill color as a hexidecimal (no hash)
   * @param {string} syle.alignment horizontal alignment of the cell
   * @param {Object} syle.border the border style, has keys: top, bottom
   * @param {string} syle.border[key] color of border in hexidecimal
   * @returns {Object} style object for excel4node workbook object
   */
  getCellStyle({ fill, alignment, border }) {
    const style = {};
    if (fill) {
      style.fill = {
        type: 'pattern',
        patternType: 'solid',
        fgColor: fill,
      };
    }
    if (alignment) {
      style.alignment = {
        horizontal: alignment,
      };
    }
    if (border) {
      style.border = {};
      Object.keys(border).forEach((key) => {
        if (!['top', 'right', 'bottom', 'left'].includes(key)) return;
        style.border[key] = {
          color: border[key],
          style: 'thin',
        };
      });
    }
    return this.workbook.createStyle(style);
  }

  /**
   * editCells along a linear path
   * @param {Object} opts the options object
   * @param {number} opts.steps the number of cells being modified
   * @param {Array<number>} opts.direction 2D array, first index is number of rows to move each step, 2nd is columns
   * @param {Object} style cell styles, see getCellStyle() for type information
   * @param {Object} values array of values to put in each cell, should have length equal to opts.steps
   * @returns {undefined}
   */
  editCells({
    steps = 0,
    direction = [0, 0],
    style = null,
    values = null,
  }) {
    const { currentCellCoords } = this;
    for (let i = 0; i < ((values && values.length) || steps); i += 1) {
      const tmpCell = this.currentSheet.cell(...direction.map((ds, j) => (ds * i) + currentCellCoords[j]));
      if (Array.isArray(values)) tmpCell.string(String(values[i]));
      if (style) tmpCell.style(this.getCellStyle(style));
    }
  }

  /**
   * addImageToTopLeft
   * @param {string} imagePath where the image is located
   * @param {Object} position of the image
   * @param {string|number} position.x the offset from the left of the worksheet
   * @param {string|number} position.y the offset from the top of the spreadsheet
   * @returns {undefined}
   */
  addImage(imagePath, { x, y }) {
    this.currentSheet.addImage({
      path: imagePath,
      type: 'picture',
      position: { type: 'absoluteAnchor', x, y },
    });
  }

  /**
   * writeToFile
   * @param {string} filename the name the spreadsheet is saved as
   * @returns {Promise<undefined>} promise resolves when file saves
   */
  writeToFile(filename) {
    const writeAsync = Promise.promisify(this.workbook.write, { context: this.workbook });
    return writeAsync(filename);
  }
}

module.exports = XlsxGenerator;
