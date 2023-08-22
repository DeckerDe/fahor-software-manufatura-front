import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import {useEffect, useState} from "react";
import axios from "axios";

function createData(time: string, amount?: number) {
    return { time, amount };
}

export default function Chart() {
    const theme = useTheme();
    const [data, setData] = useState<Array<{time: string, amount:number}>>([])

    useEffect(() => {
        const interval = setInterval(async () => {
            const resp = await axios.get("http://localhost:8000/reading")
            const reading = createData(resp.data.tempo, resp.data.peso)
            // @ts-ignore
            setData(prevState  => {
                if (prevState.length > 10) {
                    prevState.shift()
                }
                return [...prevState, reading]
            })

        }, 1000);

        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])

    return (
        <React.Fragment>
            <Title>Balança</Title>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24,
                    }}
                >
                    <XAxis
                        dataKey="time"
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}
                    />
                    <YAxis
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}
                    >
                        <Label
                            angle={270}
                            position="left"
                            style={{
                                textAnchor: 'middle',
                                fill: theme.palette.text.primary,
                                ...theme.typography.body1,
                            }}
                        >
                            Peso (g)
                        </Label>
                    </YAxis>
                    <Line
                        isAnimationActive={false}
                        type="monotone"
                        dataKey="amount"
                        stroke={theme.palette.primary.main}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}