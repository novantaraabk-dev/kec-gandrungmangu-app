"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const data = [
  { name: 'Pendapatan', anggaran: 1250000000, realisasi: 1100000000 },
  { name: 'Belanja', anggaran: 1175000000, realisasi: 950000000 },
  { name: 'Pembiayaan', anggaran: 75000000, realisasi: 75000000 },
];

const formatCurrency = (value: number) => {
    if (value >= 1e9) {
      return `Rp${(value / 1e9).toFixed(1)} M`;
    }
    return `Rp${(value / 1e6).toFixed(0)} Jt`;
}

export function ApbdesChart() {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Realisasi APBDes</CardTitle>
        <CardDescription>Perbandingan Anggaran dan Realisasi</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(Number(value))}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--accent))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
               formatter={(value: number) => formatCurrency(value)}
            />
            <Bar dataKey="anggaran" fill="hsl(var(--muted))" name="Anggaran" radius={[4, 4, 0, 0]} />
            <Bar dataKey="realisasi" fill="hsl(var(--primary))" name="Realisasi" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
