import React from 'react'


export default function StatsCard({title, value}){
return (
<div className="bg-white rounded-xl p-4 shadow-sm">
<h6 className="text-slate-500">{title}</h6>
<h3 className="text-2xl font-semibold">{value}</h3>
</div>
)
}