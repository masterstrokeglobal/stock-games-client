"use client";
import { useState } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import Container from '@/components/common/container';
import TopBar from '@/components/common/top-bar';

const FaqPage = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "How much time for withdrawals?",
            answer: "Withdrawals take 1 business day."
        },
        {
            question: "How much time for deposits?",
            answer: "Deposits take 1 business day."
        },
        {
            question: "How to withdraw?",
            answer: "To withdraw, you need to provide either bank details or UPI ID."
        },
        {
            question: "How are odds calculated?",
            answer: "Odds are calculated in real-time."
        },
        {
            question: "What is the minimum deposit amount?",
            answer: "The minimum deposit amount is Rs. 10."
        },
        {
            question: "Is there a withdrawal fee?",
            answer: "No, there is no withdrawal fee."
        },
    ];

    return (
        <Container className="flex flex-col items-center min-h-screen bg-background pt-24 ">
            <TopBar>
                FAQ
            </TopBar>
            <div className=" p-6 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
                <Accordion type="single" collapsible>
                    {faqs.map((faq, index) => (
                        <AccordionItem className='' key={index} value={index.toString()}>
                            <AccordionTrigger onClick={() => toggleAccordion(index)}>
                                {faq.question}
                            </AccordionTrigger>
                            {activeIndex === index && (
                                <AccordionContent className='text-sm'>
                                    {faq.answer}
                                </AccordionContent>
                            )}
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </Container>
    );
}

export default FaqPage;