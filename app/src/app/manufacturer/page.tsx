"use client";

import { connectToMetaMask } from "@/utils/helper";
import { ethers } from "ethers";
import { useRef, useState } from "react";
import ABI from "@/assets/abi/Supplychain.json";

type ingredient = {
  name: string;
  composition: number;
};

export default function Manufacturer() {
  const [ingredients, setIngredients] = useState<ingredient[]>([]);
  const drugNameRef = useRef<HTMLInputElement>(null);
  const ingredientNameRef = useRef<HTMLInputElement>(null);
  const compositionRef = useRef<HTMLInputElement>(null);

  const addIngredient = () => {
    const newIngredient: ingredient = {
      name: ingredientNameRef.current?.value || "",
      composition: Number(compositionRef.current?.value) || 0,
    };

    setIngredients([...ingredients, newIngredient]);
    ingredientNameRef.current!.value = "";
    compositionRef.current!.value = "";
  };

  const deleteIngredient = (index: number) => {
    setIngredients((prev) => {
      const newIngredients = [...prev];
      newIngredients.splice(index, 1);
      return newIngredients;
    });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const provider = await connectToMetaMask();
      if (!provider) return;
      // @ts-ignore
      const signer = await provider.getSigner();
      const supplychain = new ethers.Contract(
        "0xFAc3c795f09bC2ccC38071d3C428a74442132AB7",
        ABI,
        signer
      );
      const res = await supplychain.formulateDrug(
        drugNameRef.current?.value || "",
        ingredients.map((ingredient) => [
          ingredient.name,
          ingredient.composition,
        ])
      );
      await res.wait();
      console.log(res);
    } catch (error) {
      console.log("Error calling function:", error);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Manufacturer</h1>
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col">
        <h1 className="">Formulate drug</h1>
        <div className="flex gap-4">
          <label>Drug name</label>
          <input ref={drugNameRef} type="text" placeholder="e.g. Dolo" />
        </div>
        {ingredients.map((ingredient, i) => (
          <div className="flex gap-4" key={i}>
            <label>Ingredient Name</label>
            <p>{ingredient.name}</p>
            <label>Composition (%)</label>
            <p>{ingredient.composition}</p>
            <button type="button" onClick={() => deleteIngredient(i)}>
              delete
            </button>
          </div>
        ))}
        <div className="flex gap-4">
          <label>Ingredient Name</label>
          <input
            ref={ingredientNameRef}
            type="text"
            placeholder="e.g. Paracetamol"
          />
          <label>Composition (%)</label>
          <input ref={compositionRef} type="number" placeholder="e.g. 5" />
          <button type="button" onClick={addIngredient}>
            Add
          </button>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
