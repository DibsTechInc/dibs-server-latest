import ButtonUnstyled from '@mui/base/ButtonUnstyled';
import { styled } from '@mui/system';
import Stack from '@mui/material/Stack';
import XIcon from './XIcon';

const CustomButton = styled(ButtonUnstyled)`
    font-size: 0.7rem;
    background-color: #fff;
    border-radius: 8px;
    color: #9b9b9b;
    transition: all 150ms ease;
    cursor: pointer;
    border: none;
    textalign: 'center';
    line-height: 1.2;
`;

export default function UnstyledDropButton() {
    return (
        <Stack spacing={0} justifyContent="center">
            <CustomButton>
                <XIcon size={9} strokeWidth={2} stroke="#e7b2a5" />
            </CustomButton>
            <CustomButton>DROP</CustomButton>
        </Stack>
    );
}
