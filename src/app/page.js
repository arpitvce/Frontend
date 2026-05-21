"use client"
import {useState,useEffect} from "react"

export default function home(){
	 
	const [data,setData]=useState([]);
	const [branch,setBranch]=useState("CSE");

	useEffect(()=>
		{async function fetchdata()
			{ const response=await fetch(`https://rankers-eqqy.onrender.com/top/200/${branch}`);
			  const json=await response.json();
			  setData(json);
			}
			fetchdata();
		},[branch]);
	

	return (

		<div className ="bg-black text-white p-6 min-h-screen">
		<select value={branch} onChange={(e) => setBranch(e.target.value)} className="bg-black text-white p-2 rounded">
		<option value="CSE" className="bg-black text-white"> CSE </option>
		<option value="ECE" className="bg-white text-black"> ECE </option>
		<option value="IT" className="bg-black text-white"> IT </option>
		<option value="CSM" className="bg-white text-black"> CS&AIML </option>
		</select>
		<table className="mx-auto mt-6 bg-black border border-white">
		<thead>
			<tr>
			<th className="border p-3"> Rank </th>
			<th className="border p-3"> Name </th>
			<th className="border p-3"> CGPA </th>
			<th className="border p-3"> Roll No. </th>
			<th className="border p-3"> Branch </th>
			</tr>
		</thead>
		<tbody>
			{data.map((student,index)=>(
				<tr key={index}>
				<td className="border p-3"> {student.rank} </td>
				<td className="border p-3"> {student.name} </td>
				<td className="border p-3"> {student.CGPA} </td>
				<td className="border p-3"> {student.htno} </td>
				<td className="border p-3"> {student.branch} </td>
				</tr>
			))}
		</tbody>
		</table>
		</div>
		);
}

