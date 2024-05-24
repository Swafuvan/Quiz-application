"use client";
import { faXmark, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { createRef, forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import Choices from './Choices'

function QuizBuildQuestion({ focusProp,quizQuestions,setQuizQuestions }) {
    const prefixes = ['A', 'B', 'C', 'D'];
    
    const { focus, setFocusFirst } = focusProp;
    const endOfListRef = useRef(null);
    const textAreaRefs = useRef(quizQuestions.map(() => createRef()));

    function addNewquestion() {
        setFocusFirst(false);
        const lastIndexQuizQuestion = quizQuestions.length - 1
        if (quizQuestions[lastIndexQuizQuestion].mainQuestion.trim(' ').length === 0) {
            toast.error(`The question ${lastIndexQuizQuestion + 1} is still empty!`);
            textAreaRefs.current[lastIndexQuizQuestion].current.focus();
            return;
        }
 
        for (const choice of quizQuestions[lastIndexQuizQuestion].choices) {
            const singleChoice = choice.substring(2);
            if (singleChoice.trim(' ').length === 0) {
                return toast.error(`please ensure that all previous choices are filled out!`)
            }
        }
        if (quizQuestions[lastIndexQuizQuestion].correctAnswer.length === 0) {
            return toast.error(`please ensure to fill out the correct answer!`)
        }
        const newQuestion = {
            id: uuidv4(),
            mainQuestion: "",
            choices: prefixes.slice(0, 2).map((prefix) => prefix + ' '),
            correctAnswer: '',
        };
        setQuizQuestions([...quizQuestions, newQuestion]);
        textAreaRefs.current = [...textAreaRefs.current, createRef()];
    }

    function deleteQuestion(singleQuestion) {
        const quizQuestionCopy = [...quizQuestions];
        const filterQuestionToDelete = quizQuestionCopy.filter((question) => {
            return question.id !== singleQuestion.id;
        });

        const updateRefs = textAreaRefs.current.filter((ref, index) => {
            return quizQuestions[index].id !== singleQuestion.id;
        })
        textAreaRefs.current = updateRefs;
        setQuizQuestions(filterQuestionToDelete);
    }

    function handleInputChange(index, text) {
        const updateQuestions = quizQuestions.map((question, i) => {
            if (i === index) {
                return { ...question, mainQuestion: text };
            }
            return question;
        });
        setQuizQuestions(updateQuestions);
    }

    function updateTheChoicesArray(text, choiceIndex, questionIndex) {
        const updateQuestions = quizQuestions.map((question, i) => {
            if (i === questionIndex) {
                const updateChoices = question.choices.map((choice, j) => {
                    if (choiceIndex === j) {
                        return prefixes[j] + '. ' + text;
                    } else {
                        return choice;
                    }
                })
                return { ...question, choices: updateChoices }
            }
            return question
        });
        setQuizQuestions(updateQuestions);
    }

    function updateCorrectAnswer(text,questionIndex){
        const correctAnswerArray = ['A','B','C','D'];
        const questionCopy = [...quizQuestions];
        questionCopy[questionIndex].correctAnswer = correctAnswerArray.indexOf(text);
        setQuizQuestions(questionCopy);
    }

    useLayoutEffect(() => {
        if (endOfListRef.current) {
            setTimeout(() => {
                endOfListRef.current.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [quizQuestions.length]);

    useEffect(() => {
        const lastTextAreaIndex = quizQuestions.length - 1;
        if (lastTextAreaIndex >= 0) {
            const lastTextArea = textAreaRefs.current[lastTextAreaIndex].current;
            if (lastTextArea && focus) {
                lastTextArea.focus();
            }
        }
    }, [quizQuestions.length]);

    return (
        <div className="p-3 mt-6 flex justify-between border border-green-700 rounded-md">
            {/* <Toaster
                toastOptions={{
                    // className: "",
                    // duration: 1500,
                    style: {
                        fontSize: "13px"
                    },
                }}
            /> */}
            <div className="flex gap-2 flex-col w-full">
                <div className="flex gap-2 items-center">
                    <div className="bg-green-700 px-4 py-1 rounded-md text-white">2</div>
                    <span className="font-bold">Quiz Questions : </span>
                </div>
                {quizQuestions.map((singleQuestion, questionIndex) => {
                    return (
                        <div
                            className="border ml-5 p-6 mt-4 border-green-700 border-opacity-50 rounded-md flex flex-col justify-center relative"
                            key={questionIndex}
                            ref={
                                quizQuestions.length - 1 === questionIndex ? endOfListRef : null
                            }
                        >
                            <SingleQuestion
                                questionIndex={questionIndex}
                                ref={textAreaRefs.current[questionIndex]}
                                value={singleQuestion.mainQuestion}
                                onChange={(e) => {
                                    handleInputChange(questionIndex, e.target.value);
                                }}
                            />
                            <Choices
                                questionIndex={questionIndex}
                                singleQuestion={singleQuestion}
                                onChangeChoice={(text, choiceIndex, questionIndex) => {
                                    updateTheChoicesArray(text, choiceIndex, questionIndex);
                                }}
                                quizQuestions={quizQuestions}
                                setQuizQuestions={setQuizQuestions}
                                value={singleQuestion.choices}
                                prefixes={prefixes}
                            />
                            {questionIndex !== 0 && (
                                <FontAwesomeIcon
                                    onClick={() => {
                                        deleteQuestion(singleQuestion);
                                    }}
                                    icon={faXmark}
                                    width={10}
                                    height={10}
                                    className="text-red-600 absolute top-2 right-3 cursor-pointer"
                                />
                            )}

                            <CorrectAnswer onChangeCorrectAnswer={(text) => {
                                updateCorrectAnswer(text, questionIndex)
                            }} singleQuestion={singleQuestion} />

                        </div>
                    )
                })}

                <div className="w-full flex justify-center mt-3">
                    <button
                        onClick={() => {
                            addNewquestion();
                        }}
                        className="p-3 bg-green-700 rounded-md text-white w-[210px] text-[13px]"
                    >
                        Add a New Question
                    </button>
                </div>
            </div>
        </div>
    )
}

export default QuizBuildQuestion

const SingleQuestion = forwardRef(function singleQuestion({ questionIndex, value, onChange }, ref) {
    return (
        <div className='w-full border border-gray-200 mr-5 mt-3'>
            <div className='flex items-center gap-3'>
                <div className='flex gap-2 text-[15px] border-gray-200'>
                    <span>Question</span>
                    <span>{questionIndex + 1}</span>
                </div>
                <textarea className='border border-gray-200 rounded-md p-3 ml-3 w-full h-[50px] resize-none
                text-[13px] outline-none' placeholder='Your Question Here...'
                    value={value} onChange={onChange} ref={ref} />
            </div>
        </div>
    )
});


function CorrectAnswer({ onChangeCorrectAnswer,singleQuestion }) {
    const [correctAnswerInput, setCorrectAnswerInput] = useState(singleQuestion.correctAnswer);
    const prefixes = ['A','B','C','D'];
    function handleChoiceChangeInput(text) {
        const upperText = text.toUpperCase();
        for(const choice of singleQuestion.choices){
            const eachChoice = choice.substring(0,1);
            if (upperText === eachChoice || upperText === '') {
                setCorrectAnswerInput(upperText);
                onChangeCorrectAnswer(upperText);
            }
        }
    }
    return (
        <div className='flex gap-1 items-center mt-3'>
            <div className='text-[15px]'> CorrectAnswer</div>
            <div className='border border-gray-200 rounded-md p-1 w-full'>
                <input
                    value={prefixes[correctAnswerInput]}
                    maxLength={1}
                    onChange={(e) => {
                        handleChoiceChangeInput(e.target.value)
                    }}
                    className='p-3 outline-none w-full text-[13px]'
                    placeholder='Add the correct answer'
                />
            </div>
        </div>
    )
}