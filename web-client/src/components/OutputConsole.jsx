import React from 'react';

const OutputConsole = ({ text, confidence }) => {
    return (
        <div className="bg-slate-900 p-6 rounded-xl border-t-4 border-teal-500 mt-4">
            <h3 className="text-teal-400 text-xs font-bold uppercase">Decoded Output</h3>
            <div className="text-white text-3xl font-mono mt-2 min-h-[60px]">
                {text || "Listening..."}
            </div>
            <div className="text-slate-500 text-xs mt-2">Confidence: {confidence}%</div>
        </div>
    );
};
export default OutputConsole;
import React from 'react';

const OutputConsole = ({ text, confidence }) => {
    return (
        <div className="bg-slate-900 p-6 rounded-xl border-t-4 border-teal-500 mt-4">
            <h3 className="text-teal-400 text-xs font-bold uppercase">Decoded Output</h3>
            <div className="text-white text-3xl font-mono mt-2 min-h-[60px]">
                {text || "Listening..."}
            </div>
            <div className="text-slate-500 text-xs mt-2">Confidence: {confidence}%</div>
        </div>
    );
};
export default OutputConsole;
