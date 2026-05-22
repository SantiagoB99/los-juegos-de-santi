import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export function PlaysBarChart({ data }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-warm border border-ludo-brown/8">
      <p className="text-xs font-medium text-ludo-brown/50 uppercase tracking-wide mb-3">
        Partidas por mes
      </p>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} barSize={28}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#3D2B1F', opacity: 0.5 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide allowDecimals={false} />
          <Tooltip
            cursor={{ fill: 'rgba(61,43,31,0.05)' }}
            contentStyle={{
              background: '#FDF6E3',
              border: '1px solid rgba(61,43,31,0.1)',
              borderRadius: 8,
              fontSize: 12,
              color: '#3D2B1F',
            }}
            formatter={(v) => [`${v} partidas`]}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill="#C4622D" opacity={0.4 + (i / data.length) * 0.6} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
