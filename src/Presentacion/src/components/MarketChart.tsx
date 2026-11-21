import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Candle } from '../types';

interface Props { data: Candle[]; color?: string; height?: number; compact?: boolean; prefix?: string; }
export default function MarketChart({ data, color = '#24c99a', height = 280, compact = false, prefix = '$' }: Props) {
  const chartData = data.map((item) => ({ ...item, label: new Date(item.time).toLocaleString('es-BO', compact ? { hour: '2-digit', minute: '2-digit' } : { day: '2-digit', month: 'short', hour: '2-digit' }) }));
  if (!data.length) return <div className="chart-empty">No hay historial disponible para mostrar.</div>;
  return <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
      <defs><linearGradient id="marketGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.26} /><stop offset="95%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
      {!compact && <CartesianGrid stroke="#272a34" strokeDasharray="3 5" vertical={false} />}
      <XAxis dataKey="label" hide={compact} tick={{ fill: '#777d8d', fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={32} />
      {!compact && <YAxis orientation="right" tick={{ fill: '#777d8d', fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} tickFormatter={(value: number) => value >= 1000 ? `${prefix}${(value / 1000).toFixed(1)}k` : `${prefix}${value}`} width={58} />}
      <Tooltip contentStyle={{ background: '#1b1e28', border: '1px solid #303442', borderRadius: 10, color: '#f5f6fa', fontSize: 12 }} labelStyle={{ color: '#9da3b4' }} formatter={(value) => [`${prefix}${Number(value).toLocaleString('en-US', { maximumFractionDigits: 6 })}`, 'Valor']} />
      <Area type="monotone" dataKey="close" stroke={color} strokeWidth={compact ? 1.8 : 2.2} fill="url(#marketGradient)" dot={false} activeDot={compact ? false : { r: 4, strokeWidth: 0, fill: color }} isAnimationActive={false} />
    </AreaChart>
  </ResponsiveContainer>;
}
