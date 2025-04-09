import React, { useContext, useState } from 'react';
import { LanguageContext } from '../../../context/LanguageContext';
import { Language } from "../icons/Language";

export const LanguageSelector = () => {
    const { language, setLanguage } = useContext(LanguageContext);

    return (
        <div style={styles.container}>
            <div style={styles.languageButtons}>
                < Language size={22} color={"#E2E2E2"}/>
                <button
                    onClick={() => setLanguage('EN')}
                    style={{
                        ...styles.langButton,
                        textDecoration: language === "EN" ? "underline" : "none"
                    }}
                >
                    EN
                </button>
                |
                <button
                    onClick={() => setLanguage('ES')}
                    style={{
                        ...styles.langButton,
                         textDecoration: language === "ES" ? "underline" : "none"
                    }}
                >
                    ES
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        color: '#E2E2E2',
        position: 'absolute',
        top: "1vh",
        right: "1vw",
        height: '5vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',       // Centers vertically
        alignItems: 'center',           // Centers horizontally
        gap: '1rem',
        //backgroundColor: 'rgba(255, 255, 255, 0.6)', // TEMP
        zIndex: 10000,
        pointerEvents: 'auto'
    },

    languageButtons: {
        display: 'flex',
        alignItems: "center",
        gap: '0.25rem',
        fontSize: '0.9rem',
    },
    langButton: {
        color: '#E2E2E2',
        borderRadius: '50%',
        fontSize: '0.9rem',
        cursor: 'pointer',
        border: 'none',
        backgroundColor: "transparent",
        textUnderlineOffset: "0.3rem"
    },
};
