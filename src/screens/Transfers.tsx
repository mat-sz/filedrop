import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { ActionType } from '../types/ActionType';
import QrCodeSection from '../components/QrCodeSection';
import TransfersSection from '../components/TransfersSection';

const Transfers: React.FC = () => {
    const { code } = useParams<{ code: string }>();
    const [ href, setHref ] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        setHref(window.location.href);
        dispatch({ type: ActionType.SET_NETWORK_NAME, value: code });
    }, [ setHref, code, dispatch ]);

    return (
        <section className="desktop-2col">
            <TransfersSection />
            <QrCodeSection href={href} />
        </section>
    );
}

export default Transfers;
