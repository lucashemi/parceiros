import React, { useRef, useState, useEffect } from 'react';
import { CardContent } from '@mui/material';

const CardContentDrag = ({ children }: any) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [hasOverflow, setHasOverflow] = useState(false);

    useEffect(() => {
        const checkOverflow = () => {
            const element = scrollRef.current;
            if (element) {
                setHasOverflow(element.scrollWidth > element.clientWidth);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.target === scrollRef.current) {
            setIsDragging(true);
            setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
            setScrollLeft(scrollRef.current?.scrollLeft || 0);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 2; // Multiplicador para aumentar a velocidade de rolagem
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    };

    return (
        <CardContent
            sx={{
                overflowX: 'auto',
                cursor: hasOverflow ? (isDragging ? 'grabbing' : 'grab') : 'default',
                userSelect: isDragging ? 'none' : 'auto', // Impede a seleção de texto durante o arrasto
            }}
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUpOrLeave}
            onMouseUp={handleMouseUpOrLeave}
        >
            {children}
        </CardContent>
    );
};

export default CardContentDrag;
