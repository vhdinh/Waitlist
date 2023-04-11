import React from 'react';

interface PhoneNumberColumnProps {
    _id: number;
    name: string;
    party: number;
    notified: boolean;
    phoneNumber: string;
    msg: string;
    seated: boolean;
}

const phoneNumberAutoFormat = (phoneNumber: string): string => {
    const number = phoneNumber.trim().replace(/[^0-9]/g, "");

    if (number.length < 4) return number;
    if (number.length < 7) return number.replace(/(\d{3})(\d{1})/, "$1-$2");
    if (number.length < 11) return number.replace(/(\d{3})(\d{3})(\d{1})/, "$1-$2-$3");
    return number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
};

function PhoneNumberColumn(props: PhoneNumberColumnProps) {
    const phone = props.phoneNumber.toString();
    const phoneNumber = phone.substring(1);
    return <div className={'MuiDataGrid-cellContent'}>{phoneNumberAutoFormat(phoneNumber)}</div>
}

export default PhoneNumberColumn;
