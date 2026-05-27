'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { Food } from '@/types'
import { Minus, Plus } from 'lucide-react'

interface Props {
    food: Food | null
    mealType: string
    open: boolean
    onClose: () => void
    onConfirm: (food: Food, servings: number) => void
}

export default function ServingsModal({ food, mealType, open, onClose, onConfirm }: Props) {
    const [servings, setServings] = useState(1)

    if (!food) return null

    const change = (delta: number) => {
        setServings(prev => Math.max(0.5, Math.round((prev + delta) * 10) / 10))
    }

    const totalKcal = Math.round(food.kcal * servings)
    const totalProtein = Math.round(food.protein * servings)
    const totalCarbs = Math.round(food.carbs * servings)
    const totalFat = Math.round(food.fat * servings)

    const mealLabel = mealType.replace('_', ' ')

    return (
        <Sheet
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) onClose()
            }}
        >
            <SheetContent side="bottom" className="rounded-t-3xl pb-8 px-5">
                <SheetTitle className="sr-only">Adjust servings for {food.name}</SheetTitle>
                <SheetDescription className="sr-only">
                    Change serving size and confirm to add nutrition values to your meal.
                </SheetDescription>
                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 mt-1" />

                <div className="mb-5">
                    <h3 className="text-[17px] font-semibold text-gray-900">{food.name}</h3>
                    <p className="text-[13px] text-gray-400 mt-0.5">
                        P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g per {food.unit}
                    </p>
                </div>

                <div className="mb-5">
                    <p className="text-[12px] text-gray-400 mb-2">Servings</p>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => change(-0.5)}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
                        >
                            <Minus size={16} className="text-gray-600" />
                        </button>
                        <span className="text-[24px] font-bold text-gray-900 min-w-[48px] text-center">
                            {servings.toFixed(1)}
                        </span>
                        <button
                            onClick={() => change(0.5)}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
                        >
                            <Plus size={16} className="text-gray-600" />
                        </button>
                        <span className="text-[13px] text-gray-400">{food.unit}</span>
                    </div>
                </div>

                <div className="flex justify-between py-3 border-t border-b border-black/[0.06] mb-5">
                    {[
                        { label: 'kcal', value: totalKcal },
                        { label: 'protein', value: `${totalProtein}g` },
                        { label: 'carbs', value: `${totalCarbs}g` },
                        { label: 'fat', value: `${totalFat}g` },
                    ].map(({ label, value }) => (
                        <div key={label} className="text-center">
                            <div className="text-[18px] font-bold text-gray-900">{value}</div>
                            <div className="text-[11px] text-gray-400">{label}</div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => { onConfirm(food, servings); setServings(1) }}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl text-[15px] font-semibold active:scale-[0.98] transition-transform"
                >
                    Add to {mealLabel}
                </button>
            </SheetContent>
        </Sheet>
    )
}