import { Users, FileText, Landmark, BarChart2 } from "lucide-react";

export function LandingStats() {
    const stats = [
        {
          icon: <Users className="w-8 h-8 text-primary" />,
          value: "14",
          label: "Desa Terdaftar"
        },
        {
          icon: <FileText className="w-8 h-8 text-primary" />,
          value: "1.830+",
          label: "Dokumen Terarsip"
        },
        {
          icon: <Landmark className="w-8 h-8 text-primary" />,
          value: "Rp 125 M+",
          label: "Total Anggaran Dikelola"
        },
        {
          icon: <BarChart2 className="w-8 h-8 text-primary" />,
          value: "85%",
          label: "Rata-rata Realisasi"
        }
      ]

  return (
    <section id="statistics" className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-full mb-4">
                {stat.icon}
              </div>
              <p className="text-4xl font-bold tracking-tighter text-primary font-headline">{stat.value}</p>
              <p className="mt-1 text-base text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
