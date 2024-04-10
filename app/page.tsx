"use client"
import { FormEvent, useState, ChangeEventHandler, useEffect } from 'react';

const baseURL = "https://www.themealdb.com/api/json/v1/1/";

const getIntersection = function(arrays: string[][]): string[] {
    return arrays.reduce((a, b) => a.filter(c => b.includes(c)));
}


export default function App() {
    const [ingredient, setIngredient] = useState("");
    // const [inputsCt, setInputsCt] = useState(1);

    // const getOnChangeHandler = function(key: number) {
    //     return (e: any) => {
    //         let i = [...ingredients];
    //         i[key] = e.target.value;
    //         setIngredients(i);
    //     }
    // }

    const [meal, setMeal] = useState<Meal>({
        name: "",
        id: "",
        img: "",
        ingredients: [],
        steps: "", 
    });

    let renderMeals: JSX.Element = <p>Enter ingredients to find a matching recipe</p>;
    if (meal.name) {
        renderMeals = <>
            <h2 className="text-3xl font-bold mb-3">{meal.name + " " + meal.id}</h2>
            <div className="mb-3 flex gap-8">
                <img className="w-72 h-72 inline-block align-top flex-shrink-0 rounded-md"
                src={meal.img} alt={meal.name} />
                <div className="flex-shrink-0 max-w-56">
                <h4 className="text-l font-bold">Ingredients:</h4>
                <ul className="list-disc">
                    {
                        meal.ingredients.map((ing, index) => <li key={index}>{ing}</li>)
                    }
                </ul>
                </div>
                <div className="flex-grow">
                <h4 className="text-l font-bold">Instructions:</h4>
                {
                    meal.steps.split("\n").map((step, index) => <p 
                    className="m-2"
                    key={index}>{step}</p>)
                }
                </div>
            </div>
            
        </>
    }

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        let filterURL = baseURL + "filter.php?i=";
        let ing = ingredient.replaceAll(' ', '_')
        const getIds = async () => {
            return fetch(baseURL + `filter.php?i=${ing}`)
                .then(response => response.json())
                .then(data => {
                    if (data.meals !== null) {
                        return data.meals.map((meal: any) => meal.idMeal);
                    } else {
                        return [];
                    }
                });
        }

        const mealIds = await getIds();
        if (mealIds.length === 0) {
            setMeal(
                {
                    name: "No meals found with those ingredients!",
                    img: "",
                    id: "",
                    ingredients: [],
                    steps: "",
                }
            )
            return;
        } else {
            console.log(mealIds);
        }
        const id = mealIds[Math.floor(Math.random() * mealIds.length)];
        fetch(baseURL + `lookup.php?i=${id}`)
            .then(response => response.json())
            .then(data => data.meals[0])
            .then(mealData => {
                let meal: Meal = {
                    name: mealData.strMeal,
                    id: mealData.idMeal,
                    img: mealData.strMealThumb,
                    steps: mealData.strInstructions,
                    ingredients: [],
                };
                for (let i = 1; i <= 20; i++) {
                    if (mealData[`strIngredient${i}`] && mealData[`strMeasure${i}`]) {
                        meal.ingredients.push(
                            mealData[`strMeasure${i}`] + " " + mealData[`strIngredient${i}`]
                        );
                    }
                }
                setMeal(meal);
            });


    }
    return (
        <>
            <div className="bg-slate-50 text-slate-700 font-bold pt-4 pb-3 pl-3 pr-3">
            <h1 className="text-4xl">What should I cook tonight?</h1>
            </div>
            <div className="bg-gradient-to-r  from-yellow-500 to-red-700 h-2"></div>
            <div className="main bg-slate-50 text-black pt-3 pl-5 pr-5 mb-0 min-h-screen">
            <form onSubmit={submitHandler}
                  className="inline-block">
                <div>
                    
                    <input type="text"
                           value={ingredient}
                           onChange={(e) => setIngredient(e.target.value)}
                           placeholder="Enter an ingredient..."
                           className="border-slate-400 border-2 rounded-md mb-2"/>
                    <button
                        type="button"
                        //onClick={addInput}
                        className="border-slate-400 border-2 w-8 h-8 ml-2 rounded-md"
                    >+</button>
                </div>
                <button type="submit"
                        className="border-slate-400 border-2 h-8 rounded-md p-1">Search</button>
            </form>
            <div className="mt-5">{renderMeals}</div>
            </div>
        </>
    )
}