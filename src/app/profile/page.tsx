'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import MobileShell from '@/components/layout/MobileShell'
import PageHeader from '@/components/layout/PageHeader'
import { useProfile, useUpdateProfile, useRecalculateTargets } from '@/lib/queries/useProfile'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  User,
  Target,
  Dumbbell,
  Calculator,
  ChevronRight,
  Save,
  RefreshCw,
} from 'lucide-react'

type Section = 'personal' | 'targets' | 'workout' | null

const GOAL_OPTIONS = [
  { value: 'lean_bulk', label: 'Lean bulk', desc: 'Gain muscle with minimal fat' },
  { value: 'maintain', label: 'Maintain', desc: 'Keep current weight' },
  { value: 'lose_fat', label: 'Lose fat', desc: 'Cut while preserving muscle' },
]

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Desk job, no gym' },
  { value: 'light', label: 'Light', desc: 'Exercise 1–3x/week' },
  { value: 'moderate', label: 'Moderate', desc: 'Gym 3–4x/week' },
  { value: 'active', label: 'Active', desc: 'Gym 4–5x/week' },
  { value: 'very_active', label: 'Very active', desc: 'Gym 6x + physical job' },
]

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()
  const recalculate = useRecalculateTargets()

  const [openSection, setOpenSection] = useState<Section>(null)
  const [form, setForm] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)

  const set = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))
  const get = (key: string) => {
    const value = form[key] ?? profile?.[key as keyof typeof profile]
    return Number.isNaN(value) ? '' : value ?? ''
  }

  const setNumberField = (key: string, value: string, integer = false) => {
    if (value === '') {
      set(key, '')
      return
    }

    const parsed = integer ? Number.parseInt(value, 10) : Number.parseFloat(value)
    set(key, Number.isNaN(parsed) ? '' : parsed)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile.mutateAsync(form)
      setForm({})
      toast.success('Profile updated')
      setOpenSection(null)
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleRecalculate = async () => {
    try {
      await recalculate.mutateAsync()
      toast.success('Targets recalculated from your stats')
    } catch {
      toast.error('Failed to recalculate')
    }
  }

  if (isLoading) {
    return (
      <MobileShell>
        <PageHeader title="Profile" />
        <div className="mx-4 space-y-3 mt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      </MobileShell>
    )
  }

  if (!profile) return null

  const hasPendingChanges = Object.keys(form).length > 0

  return (
    <MobileShell>
      <PageHeader
        title="Profile"
        subtitle="Your personal settings"
        right={
          hasPendingChanges ? (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 bg-[#1D9E75] text-white px-3 py-1.5 rounded-full"
            >
              <Save size={13} />
              <span className="text-[12px] font-semibold">
                {saving ? 'Saving...' : 'Save'}
              </span>
            </button>
          ) : null
        }
      />

      <div className="mx-4 space-y-3 mb-4">

        {/* avatar + name */}
        <div className="bg-white rounded-2xl border border-black/6 p-4 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center shrink-0">
            <span className="text-white text-[22px] font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="text-[18px] font-semibold text-gray-900">{profile.name}</div>
            <div className="text-[12px] text-gray-400 mt-0.5">
              {profile.currentWeightKg}kg · {profile.heightCm}cm · {profile.age}y
            </div>
            <span className="text-[11px] font-medium bg-[#EAF3DE] text-[#3B6D11] px-2 py-0.5 rounded-full mt-1 inline-block capitalize">
              {profile.goal.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* personal info */}
        <div className="bg-white rounded-2xl border border-black/6 shadow-sm overflow-hidden">
          <button
            onClick={() => setOpenSection(openSection === 'personal' ? null : 'personal')}
            className="w-full flex items-center justify-between px-4 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                <User size={15} className="text-blue-500" />
              </div>
              <span className="text-[14px] font-semibold text-gray-900">Personal info</span>
            </div>
            <ChevronRight
              size={16}
              className={cn(
                'text-gray-300 transition-transform',
                openSection === 'personal' && 'rotate-90'
              )}
            />
          </button>

          {openSection === 'personal' && (
            <div className="px-4 pb-4 space-y-3 border-t border-black/4">
              {[
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'age', label: 'Age', type: 'number' },
                { key: 'heightCm', label: 'Height (cm)', type: 'number' },
                { key: 'currentWeightKg', label: 'Current weight (kg)', type: 'number' },
                { key: 'goalWeightKg', label: 'Goal weight (kg)', type: 'number' },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="text-[12px] text-gray-400 block mb-1">{label}</label>
                  <input
                    type={type}
                    value={get(key)}
                    onChange={e => {
                      if (type === 'number') {
                        setNumberField(key, e.target.value)
                        return
                      }

                      set(key, e.target.value)
                    }}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[14px] bg-gray-50 outline-none focus:border-gray-400"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* goal + activity */}
        <div className="bg-white rounded-2xl border border-black/6 shadow-sm overflow-hidden">
          <button
            onClick={() => setOpenSection(openSection === 'targets' ? null : 'targets')}
            className="w-full flex items-center justify-between px-4 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
                <Target size={15} className="text-[#1D9E75]" />
              </div>
              <div className="text-left">
                <div className="text-[14px] font-semibold text-gray-900">Goals & targets</div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  {profile.calorieGoal} kcal · {profile.proteinGoalG}g protein
                </div>
              </div>
            </div>
            <ChevronRight
              size={16}
              className={cn(
                'text-gray-300 transition-transform',
                openSection === 'targets' && 'rotate-90'
              )}
            />
          </button>

          {openSection === 'targets' && (
            <div className="px-4 pb-4 space-y-4 border-t border-black/4">

              {/* goal */}
              <div>
                <label className="text-[12px] text-gray-400 block mb-2">Fitness goal</label>
                <div className="space-y-2">
                  {GOAL_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => set('goal', opt.value)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-left',
                        get('goal') === opt.value
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-100 hover:border-gray-200'
                      )}
                    >
                      <div>
                        <div className="text-[13px] font-medium text-gray-900">{opt.label}</div>
                        <div className="text-[11px] text-gray-400">{opt.desc}</div>
                      </div>
                      {get('goal') === opt.value && (
                        <div className="w-4 h-4 rounded-full bg-gray-900 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* activity level */}
              <div>
                <label className="text-[12px] text-gray-400 block mb-2">Activity level</label>
                <div className="space-y-2">
                  {ACTIVITY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => set('activityLevel', opt.value)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-left',
                        get('activityLevel') === opt.value
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-100 hover:border-gray-200'
                      )}
                    >
                      <div>
                        <div className="text-[13px] font-medium text-gray-900">{opt.label}</div>
                        <div className="text-[11px] text-gray-400">{opt.desc}</div>
                      </div>
                      {get('activityLevel') === opt.value && (
                        <div className="w-4 h-4 rounded-full bg-gray-900 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* auto calculate toggle */}
              <div className="flex items-center justify-between py-2 border-t border-black/4">
                <div>
                  <div className="text-[13px] font-medium text-gray-900">Auto-calculate targets</div>
                  <div className="text-[11px] text-gray-400">Recalculate macros when weight changes</div>
                </div>
                <button
                  onClick={() => set('autoCalculateTargets', !get('autoCalculateTargets'))}
                  className={cn(
                    'w-11 h-6 rounded-full transition-colors relative',
                    get('autoCalculateTargets') ? 'bg-[#1D9E75]' : 'bg-gray-200'
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                      get('autoCalculateTargets') ? 'translate-x-5' : 'translate-x-0.5'
                    )}
                  />
                </button>
              </div>

              {/* manual targets */}
              {!get('autoCalculateTargets') && (
                <div className="space-y-3 pt-1">
                  <p className="text-[12px] text-gray-400">Manual targets</p>
                  {[
                    { key: 'calorieGoal', label: 'Calorie goal (kcal)' },
                    { key: 'proteinGoalG', label: 'Protein (g)' },
                    { key: 'carbsGoalG', label: 'Carbs (g)' },
                    { key: 'fatGoalG', label: 'Fat (g)' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-[12px] text-gray-400 block mb-1">{label}</label>
                      <input
                        type="number"
                        value={get(key)}
                        onChange={e => setNumberField(key, e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[14px] bg-gray-50 outline-none focus:border-gray-400"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* recalculate button */}
              <button
                onClick={handleRecalculate}
                disabled={recalculate.isPending}
                className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={14} className={cn(recalculate.isPending && 'animate-spin')} />
                Recalculate targets from current stats
              </button>
            </div>
          )}
        </div>

        {/* workout schedule */}
        <div className="bg-white rounded-2xl border border-black/6 shadow-sm overflow-hidden">
          <button
            onClick={() => setOpenSection(openSection === 'workout' ? null : 'workout')}
            className="w-full flex items-center justify-between px-4 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center">
                <Dumbbell size={15} className="text-purple-500" />
              </div>
              <div className="text-left">
                <div className="text-[14px] font-semibold text-gray-900">Workout schedule</div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  {profile.workoutDaysPerWeek}x/week · Rest: {profile.restDays.join(', ')}
                </div>
              </div>
            </div>
            <ChevronRight
              size={16}
              className={cn(
                'text-gray-300 transition-transform',
                openSection === 'workout' && 'rotate-90'
              )}
            />
          </button>

          {openSection === 'workout' && (
            <div className="px-4 pb-4 space-y-3 border-t border-black/4">
              <div>
                <label className="text-[12px] text-gray-400 block mb-1">Sessions per week</label>
                <div className="flex gap-2">
                  {[3, 4, 5, 6].map(n => (
                    <button
                      key={n}
                      onClick={() => set('workoutDaysPerWeek', n)}
                      className={cn(
                        'flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-colors',
                        get('workoutDaysPerWeek') === n
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[12px] text-gray-400 block mb-1">Water goal (glasses)</label>
                <input
                  type="number"
                  value={get('waterGoalGlasses')}
                  onChange={e => setNumberField('waterGoalGlasses', e.target.value, true)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[14px] bg-gray-50 outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="text-[12px] text-gray-400 block mb-1">Weekly review day</label>
                <div className="flex gap-1.5 flex-wrap">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                    <button
                      key={day}
                      onClick={() => set('weeklyReviewDay', day)}
                      className={cn(
                        'px-2.5 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-colors',
                        get('weeklyReviewDay') === day
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* current targets summary */}
        <div className="bg-white rounded-2xl border border-black/6 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Calculator size={15} className="text-amber-500" />
            <span className="text-[13px] font-semibold text-gray-800">Current targets</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Calories', value: `${profile.calorieGoal} kcal`, color: '#1D9E75' },
              { label: 'Protein', value: `${profile.proteinGoalG}g`, color: '#1D9E75' },
              { label: 'Carbs', value: `${profile.carbsGoalG}g`, color: '#378ADD' },
              { label: 'Fat', value: `${profile.fatGoalG}g`, color: '#EF9F27' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="text-[11px] text-gray-400 mb-0.5">{label}</div>
                <div className="text-[16px] font-bold" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </MobileShell>
  )
}