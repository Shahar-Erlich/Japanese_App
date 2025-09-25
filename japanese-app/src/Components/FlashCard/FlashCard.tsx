import React from "react";
import "./FlashCard.css";

type FlashCardProps = {
    jp?: string;
    kanji: string;
    eng?: string;
};

const FlashCard = ({ jp, kanji, eng }: FlashCardProps) => {
    return (
        <div className="Card">
            <h1>{kanji}</h1>
            {jp && <p className="Kana">{jp}</p>}
            {eng && <p className="English">{eng}</p>}
        </div>
    );
};

export default FlashCard;
