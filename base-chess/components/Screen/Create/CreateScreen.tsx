// @ts-ignore
import { NextEditor } from "next-chessground";
import { useRef, useState } from "react";

import { StyledButton } from "@/components/Layout/StyledButton";

const CreateScreen = () => {
  const ref = useRef();
  const [description, setDescription] = useState("");

  const handleSelect = (fen: any) => {
    //
  };

  async function handleSubmit(e: any) {
    e.preventDefault();
    // do stuff
  }

  function handleDescriptionChange(e: any) {
    setDescription(e.target.value);
  }

  const placeholderDescription = `Black just played Qe2, which is a big mistake. White to play and win. I didn't find the move and ended up loosing badly. Can you find it?`;
  const tooltip = `80% of the proceeds from mint of this puzzle will go to the creator`;

  return (
    <div className="mt-20 flex flex-row justify-center">
      <div className="w-96 text-black p-5 rounded-md bg-slate-50">
        <NextEditor ref={ref} onSelect={handleSelect} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="ml-20 w-96 flex flex-col justify-between"
      >
        <div className="flex flex-col space-y-5">
          <div className="text-sm font-extralight">{tooltip}</div>
          <div className="text-xl font-bold">Description</div>
          <textarea
            className="input input-bordered text-white p-2 h-44 bg-slate-500 text-sm rounded-md"
            value={description}
            onChange={handleDescriptionChange}
            disabled={false}
            placeholder={placeholderDescription}
          />
        </div>
        <StyledButton className="w-32 mb-40">Submit</StyledButton>
      </form>
    </div>
  );
};

export default CreateScreen;
