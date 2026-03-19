import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DynamicSelectProps {
    label: string;
    options: string[];
    value: string | string[];
    onChange: (val: any) => void;
    otherPlaceholder: string;
    multi?: boolean;
    required?: boolean;
}

export const DynamicSelect: React.FC<DynamicSelectProps> = ({
    label,
    options,
    value,
    onChange,
    otherPlaceholder,
    multi = false,
    required = false
}) => {
    const isArray = Array.isArray(value);
    const selectedOptions = isArray ? (value as string[]) : [value as string].filter(Boolean);
    
    // Check if "Other" is effectively selected
    // If multi: is 'Other' in the array? (Or if there are custom values not in options)
    // Actually, let's keep it simple: "Other" is an explicit toggle.
    const [showOther, setShowOther] = useState(false);
    const [customValue, setCustomValue] = useState('');

    useEffect(() => {
        // If the current value contains something NOT in the options, 
        // it means a custom value was previously set.
        if (multi) {
            const hasCustom = selectedOptions.some(opt => !options.includes(opt) && opt !== 'Other');
            if (hasCustom) {
                setShowOther(true);
                // Extract the first custom value for the input (simplification)
                const custom = selectedOptions.find(opt => !options.includes(opt) && opt !== 'Other');
                if (custom && custom !== customValue) setCustomValue(custom);
            }
        } else {
            const v = value as string;
            if (v && !options.includes(v) && v !== 'Other') {
                setShowOther(true);
                setCustomValue(v);
            }
        }
    }, [value, options, multi]);

    const handleOptionToggle = (opt: string) => {
        if (opt === 'Other') {
            setShowOther(!showOther);
            if (showOther && !multi) {
                onChange(''); // Deselect other
                setCustomValue('');
            } else if (!multi) {
                onChange('Other');
            } else {
                // Multi and toggling Other on
                if (!showOther) {
                    onChange([...selectedOptions, 'Other']);
                } else {
                    onChange(selectedOptions.filter(o => o !== 'Other' && options.includes(o))); // Remove custom stuff
                    setCustomValue('');
                }
            }
            return;
        }

        if (multi) {
            if (selectedOptions.includes(opt)) {
                onChange(selectedOptions.filter(o => o !== opt));
            } else {
                onChange([...selectedOptions, opt]);
            }
        } else {
            setShowOther(false);
            setCustomValue('');
            onChange(opt);
        }
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCustomValue(val);
        
        if (multi) {
            // Replace the old custom value or add new
            const standardSelections = selectedOptions.filter(o => options.includes(o) || o === 'Other');
            onChange(val ? [...standardSelections, val] : standardSelections);
        } else {
            onChange(val);
        }
    };

    return (
        <div className="space-y-3 w-full">
            <label className="text-sm font-bold text-white uppercase tracking-wider ml-1">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="flex flex-wrap gap-3">
                {options.map((opt) => {
                    // For single select, if showOther is true and customValue matches value, don't highlight standard options unless they match.
                    // Wait, if opt is "Other", it's active if showOther is true.
                    const isActive = opt === 'Other' ? showOther : selectedOptions.includes(opt);
                    
                    return (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => handleOptionToggle(opt)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${
                                isActive 
                                    ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                            }`}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence>
                {showOther && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="pt-2 overflow-hidden"
                    >
                        <input
                            type="text"
                            value={customValue}
                            onChange={handleCustomChange}
                            placeholder={otherPlaceholder}
                            required={required && showOther}
                            className="w-full bg-black/20 border border-blue-500/50 rounded-xl py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
