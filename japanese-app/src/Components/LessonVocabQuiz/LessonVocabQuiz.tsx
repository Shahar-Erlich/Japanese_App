import React, { useEffect, useState } from "react";
import FlashCard from "../FlashCard/FlashCard";
import glossaries from "../../../glossaries.json";
import "./LessonVocabQuiz.css";

type Vocab = {
    jp: string;
    kanji: string;
    eng: string;
};

const LessonVocabQuiz = () => {
    const [random, setRandom] = useState<Vocab | null>(null);
    const [selected, setSelected] = useState("1");
    const [answer, setAnswer] = useState("");
    const [showKana, setShowKana] = useState(false);
    const [showEnglish, setShowEnglish] = useState(false);
    const [confirmation, setConfirmation] = useState("")

    function checkAnswer() {
        if (random &&
            Object.values(random).some((val) =>
                String(val).toLowerCase().includes(answer.toLowerCase())
            )) {
            console.log("✅ Correct!");
            setConfirmation("✅ Correct!");
            setShowEnglish(true);
            if (random.kanji) setShowKana(true);
            setTimeout(() => {
                setShowEnglish(false);
                setShowKana(false);
                setConfirmation("");
                getRandomWord();
            }, 1000);

        } else {
            console.log("❌ Try Again!");
            setConfirmation("❌ Try Again!");
            setTimeout(() => {
                setConfirmation("");
            }, 3000);
        }
        setAnswer("");
    }

    function getRandomWord() {
        const words = glossaries[selected];
        setRandom(words[Math.floor(Math.random() * words.length)]);
        setShowKana(false);
        setShowEnglish(false);
    }

    useEffect(() => {
        getRandomWord();
    }, [selected]);

    return (
        <div className="LessonContainer">
            {/* Top bar */}
            <div className="TopBar">
                <h2>Lesson {selected}</h2>
                <select value={selected} onChange={(e) => setSelected(e.target.value)}>
                    {Array.from({ length: 23 }, (_, i) => (
                        <option key={i + 1}>{i + 1}</option>
                    ))}
                </select>
            </div>

            {/* FlashCard */}
            {random && (
                <FlashCard
                    jp={showKana ? random.jp : ""}
                    kanji={random.kanji || random.jp}
                    eng={showEnglish ? random.eng : ""}
                />
            )}

            {/* Answer input */}
            <div className="InputSection">
                <input
                    placeholder="Enter Romaji / Kana"
                    onChange={(e) => setAnswer(e.target.value)}
                    value={answer}
                />
                <button onClick={checkAnswer}>Submit</button>
            </div>

            {/* Controls */}
            <div className="Controls">
                {random?.kanji && <button onClick={() => setShowKana(true)}>Show Kana</button>}
                <button onClick={() => setShowEnglish(true)}>Show English</button>
                <button onClick={getRandomWord}>Skip</button>
            </div>
            <h1>{confirmation}</h1>

        </div>
    );
};

export default LessonVocabQuiz;
