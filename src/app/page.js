 async function getranks(numbers,branch){

  const url=await fetch(`https://projects-8xja.vercel.app/top/${numbers}/${branch}`);
  const result=await url.json();
  return result;
}

export default async function allranks(){

  const data=await getranks(100,"CSE");

  return (

    <table className="mx-auto border-separate border border-spacing-y-0.5 bg-black text-white p-5">
      <thead>
      <tr>
            <th className="p-10"> Rank </th>
            <th className="p-10"> Name </th>
            <th className="p-15"> Roll No.</th>
            <th className="p-15"> Branch </th>
            <th className="p-5"> CGPA </th>
      </tr>
      </thead>
      <tbody>
      {data.map((student,index)=> (
            <tr key={index+1}>
              <td>  {student.rank} </td>
              <td> {student.name}</td>
              <td> {student.htno}</td>
              <td> {student.branch}</td>
              <td> {student.CGPA} </td>
            </tr>
      ))}
      </tbody>
    </table>
  )

}

