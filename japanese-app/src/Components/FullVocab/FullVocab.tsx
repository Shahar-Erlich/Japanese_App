import React from 'react'
import { useEffect, useState } from "react";
import glossaries from '../../../glossaries.json'

type Vocab = {
    jp: string;
    romaji: string;
    kanji: string;
    eng: string;
};


const FlashCard = () => {
    const [vocab, setVocab] = useState<Vocab[]>([]);
    const [selected, setselected] = useState("1")
    useEffect(() => {
        // every time lesson changes, load that vocab
        console.log("Current lesson:", selected);
        setVocab(glossaries[selected])
    }, [selected]);

    return (
        <div>
            <select
                value={selected}
                onChange={(e) => setselected(e.target.value)} // update state
            >
                {Array.from({ length: 23 }, (_, i) => (
                    <option key={i + 1}>{i + 1}</option>
                ))}
            </select>
            <h1>Lesson {selected} Vocabulary</h1>
            <table border={1}>
                <thead>
                    <tr>
                        <th>Japanese</th>
                        {
                            +selected <= 2 ? (
                                <>
                                    <th>Romaji</th>
                                    <th>Kanji</th>
                                </>
                            ) : (
                                <th>Kanji</th>
                            )
                        }

                        <th>English</th>
                    </tr>
                </thead>
                <tbody>
                    {vocab.map((v, i) => (
                        +selected <= 2 ?
                            <tr key={i}>
                                <td>{v.jp}</td>
                                <td>{v.romaji}</td>
                                <td>{v.kanji}</td>
                                <td>{v.eng}</td>
                            </tr>
                            :
                            <tr key={i}>
                                <td>{v.jp}</td>
                                <td>{v.kanji}</td>
                                <td>{v.eng}</td>
                            </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default FlashCard



