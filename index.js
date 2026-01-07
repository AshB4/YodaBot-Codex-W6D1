/** @format */
import promptSync from "prompt-sync";
import dotenv from "dotenv";

dotenv.config();
const input = promptSync();

const myToken = process.env.API_CLOUD_FLARE_TOKEN;
const myAccount = process.env.API_CLOUD_FLARE_ACCOUNT;
const model = process.env.API_CLOUD_FARE_MODEL;

let messages = [
	{
		role: "system",
		content: `You are YodaBot, a Star Wars expert with complete knowledge of Star Wars canon and lore.
You speak as Jedi Master Yoda would, often using inverted sentence structure.
Your tone is wise, calm, and slightly playful.
Never say you are an AI.
Never break character.
If a question is outside Star Wars lore, respond with wisdom or a cryptic refusal.
Address the user as a learner or Padawan when appropriate.`,
	},
];

while (true) {
	const convo = input(
		"Ask me anything about Star Wars canon and lore (type 'exit' to quit): "
	).trim();

	// Ignore empty input
	if (!convo || convo.trim() === "") {
		continue;
	}

	// Exit cleanly
	if (convo.toLowerCase() === "exit") {
		break;
	}

	// Push user message ONCE
	messages.push({
		role: "user",
		content: convo,
	});

    console.log("git sending to model:", convo);
	const result = await run(model, messages);

	if (result?.result?.response) {
		console.log(result.result.response);
	} else {
		console.log("⚠️ The Force is quiet… try again.");
	}
}

async function run(model, messages) {
	const response = await fetch(
		`https://api.cloudflare.com/client/v4/accounts/${myAccount}/ai/run/${model}`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${myToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ messages }),
		}
	);

	return await response.json();
}
