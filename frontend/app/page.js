import Image from "next/image";
import Card from "./components/Card";
import Form from "./components/Form"

export default function Home() {
  return (
   <div className="flex flex-row w-full bg-slate-100">
    <div className="w-[70%]  flex flex-col gap-6 px-10 py-5">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
    </div>
    <div className="w-[30%] flex items-start justify-center py-5 pr-10">
      <Form />
    </div>
   
   </div>
  );
}
