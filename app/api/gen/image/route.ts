export const maxDuration = 30;
export const POST = async (req: Request) => {
    try {
        const { text, height, width, model, count } = await req.json();
       
        sendMessage (text)
        const res = await genDallE(text, height, width, model, count);
        // console.log(res)
        return Response.json(res);
    } catch (error) {
        return Response.json({
            err: true,
            msg: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

const genDallE = async (
    text: string,
    height = 1024,
    width = 1024,
    model: string = 'dall-e-3',
    count = 1
) => {
    const res = await fetch("https://api.gamma.app/media/images/generate", {
        headers: {
            "accept": "*/*",
            "accept-language": "en-GB,en;q=0.9,en-US;q=0.8",
            "content-type": "application/json",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Microsoft Edge\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": "\"Android\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "cookie": "gamma_visitor_id=id5ncyjt5svwbok; ajs_anonymous_id=id5ncyjt5svwbok; optimizelyEndUserId=oeu1732259788864r0.9679300092125334; pscd=try.gamma.app; _gcl_au=1.1.1621209284.1732259791; _ga=GA1.1.1816405733.1732259797; _ga_JTMLK9TNNV=GS1.1.1732259797.1.0.1732259797.0.0.0; _rdt_uuid=1732259797418.7425e3b6-7e31-4200-b6b3-2e5959864e5d; gamma_logged_in=true; gamma_session=eyJwYXNzcG9ydCI6eyJ1c2VyIjp7ImFjY2Vzc190b2tlbiI6ImV5SnJhV1FpT2lKVlJrOW1ialFyWkd0RlJFcHZPSE5RWEM5MlowMTVZak5VVm1oRlVsVTBTbGhOZVNzMU5XTmtOa0pxUVQwaUxDSmhiR2NpT2lKU1V6STFOaUo5LmV5SnpkV0lpT2lJMU1UUTNNRFJrTkMwNU5UYzFMVFE0T0dZdE9HUXhaaTFtTVRjMlpUaG1PR0kwTnpjaUxDSmpiMmR1YVhSdk9tZHliM1Z3Y3lJNld5SjFjeTFsWVhOMExUSmZNbTlzTmxKQ1RubFpYMGR2YjJkc1pTSmRMQ0pwYzNNaU9pSm9kSFJ3Y3pwY0wxd3ZZMjluYm1sMGJ5MXBaSEF1ZFhNdFpXRnpkQzB5TG1GdFlYcHZibUYzY3k1amIyMWNMM1Z6TFdWaGMzUXRNbDh5YjJ3MlVrSk9lVmtpTENKMlpYSnphVzl1SWpveUxDSmpiR2xsYm5SZmFXUWlPaUl5TVhCaGN6QmxNV0YwWkhCdE1tZGlhbUZ2TmpjNWFHTmhiU0lzSW05eWFXZHBibDlxZEdraU9pSTBNREV5TWpaaE5TMWhaVEZpTFRRd1pqa3RPVFprTUMwNU9UUTFOVFkxTlRRNE1qTWlMQ0owYjJ0bGJsOTFjMlVpT2lKaFkyTmxjM01pTENKelkyOXdaU0k2SW05d1pXNXBaQ0J3Y205bWFXeGxJR1Z0WVdsc0lpd2lZWFYwYUY5MGFXMWxJam94TnpNeU1qVTVOems1TENKbGVIQWlPakUzTXpJeU5qTXpPVGtzSW1saGRDSTZNVGN6TWpJMU9UYzVPU3dpYW5ScElqb2lObU5rTW1OaU56UXRNR00wTnkwME1Ea3dMV0l4TWpFdE1ESTBZVFJpTkRWak1tSXhJaXdpZFhObGNtNWhiV1VpT2lKbmIyOW5iR1ZmTVRBeU5UQTVNekk0T0RFM01ERTFNREl4T0RBMkluMC5KV0F1aU5QNzROeXdZVVdyYjUybEY4SC1EbFFNdjBKcXFTYloxVFBENFktendybjhZVHdCYTQ0WE5QZ1BTcVpaYl9Cbm1EVVQ1RWNLMXhDeHJwOUF5QjZCeHJEZFRnNkpSY2pZak55NFFRYVNxM2NYaVdtQlpKeGpoVWdiSElGSlFzOEF1Nm1XOURSLXlkRlRabVFzZzE5Qzg5SW1LRGlIM3BCbWhDdHk0ajF4N3pERHY3c0s4cEE2RjA4LUpKZk1PZ2hOb1lVMGRQQU5QdkhydlY2Z0I5WXVYcUtIdkQ5aVN3aFEyTWJONlBzRHNxZEpJaXI0RXZaYXRYdFI2Nkh3ZlBBbFEwOHZSOGRoOWY5UE0wcThocHpyZzU4b1F4MDVVdW9qei04TXlBR0hXWVV6aThISEpoMXJyS0Yzd25GR2ZDTjJsQk1xNXFmLUpmS1JMYnl6ZkEiLCJ1c2VyaW5mbyI6eyJzdWIiOiI1MTQ3MDRkNC05NTc1LTQ4OGYtOGQxZi1mMTc2ZThmOGI0NzciLCJpZGVudGl0aWVzIjoiW3tcInVzZXJJZFwiOlwiMTAyNTA5MzI4ODE3MDE1MDIxODA2XCIsXCJwcm92aWRlck5hbWVcIjpcIkdvb2dsZVwiLFwicHJvdmlkZXJUeXBlXCI6XCJHb29nbGVcIixcImlzc3VlclwiOm51bGwsXCJwcmltYXJ5XCI6dHJ1ZSxcImRhdGVDcmVhdGVkXCI6MTczMjI1MDIxMDk2N31dIiwiZW1haWxfdmVyaWZpZWQiOiJmYWxzZSIsIm5hbWUiOiJUZWNobmljYWwgVGFsaGEiLCJnaXZlbl9uYW1lIjoiVGVjaG5pY2FsIiwiZmFtaWx5X25hbWUiOiJUYWxoYSIsImVtYWlsIjoidGFsaGFyaWF6NTQyNTg2OUBnbWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSjkyU3VOWmRNQUhUMncwSW1WSThob0RoT0xLRjcxc2RuRVlPeldtS0d0VjFJU29wMD1zOTYtYyIsInVzZXJuYW1lIjoiZ29vZ2xlXzEwMjUwOTMyODgxNzAxNTAyMTgwNiIsImlzcyI6Imh0dHBzOi8vY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb20vdXMtZWFzdC0yXzJvbDZSQk55WSJ9LCJpZCI6IndkZ296OTlpenF0anY3dyJ9fX0=; gamma_session.sig=MSUBT4u5bQ4_Ndc6WUJeJDKgIjw; _fbp=fb.1.1732259799981.181706310592331043; ajs_user_id=wdgoz99izqtjv7w; OptanonConsent=isGpcEnabled=0&datestamp=Fri+Nov+22+2024+12%3A16%3A41+GMT%2B0500+(Pakistan+Standard+Time)&version=202408.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=7b015f48-9ce4-4ac1-b2e2-c3d3107ecab8&interactionCount=1&isAnonUser=1&landingPath=https%3A%2F%2Fgamma.app%2Fsignup&groups=C0001%3A1%2CC0003%3A1%2CC0002%3A1%2CC0004%3A0; cf_clearance=Id9tYjZP5B7IdgeeVOYGwnXNtiIa_3q2e4tNOHeFlCg-1732259807-1.2.1.1-PFXTRgw9c7VRnqJfdTSIAxTsOvlrCrvZA7Wqc.ezHUD1DDCgqTwOrCtMbG.DpcKFHTyA5ploKvOG99CYWdqkK2x9rpBere898.JQqnZocvaH6jFR0bT1eWITgkqo_ZQy3lDVsvct2CZmMFnvdoCp2S9r8d5wVjMewrxc9BcVyyDzpmpfVq7k5JyYZGh4qVMlYSzzrOYMRF.IcBwjtDxmB97yN1ALOgsAJIw_FNrVUBxX8NuQeUAheag1BUbqst011bSr9u3XHWLwngdalBgqWmq0jY1OexDjNaw5VQ9.O44zRKcVQ2zI5iwQtF.WsGi4j3zPIng3ZAYv8L7d17ciG0NXmlwoYDbw2GzK1COEHBHOUKPTW4_X135O6UirmSbmsXDDSh0Ojz2HsPRwbJcaNw; intercom-device-id-ihnzqaok=92832443-5fc7-48ba-96f3-acf613bea9bb; intercom-session-ihnzqaok=MjlIQzdlTlo4K2NQTmFVOFZHL1Vad2UxcFRZbWtsWVgzZ015cFFkdUEzM0JtRjBBTjFqYjQyM21MYkpZUFhCby0tUzYzYTE4Mit3SFM4TDcyWXJsNVMyZz09--9fc0ef977310c65f858cff626f2a4b68e9445fa6; __stripe_mid=ce2ad081-38a8-46c2-8117-a507aaae14b619d8aa; __stripe_sid=0cf666a2-6070-4f42-a8be-f3f8a007e40a608bad; __cf_bm=u5NyEcuo.tyTw6UAK_TAr9ZSr28uRvcIp1aKfcTZlbs-1732259939-1.0.1.1-dTfBwH5Tw65t1mzUvH9QNBRV7xCQkudQYO1Z6MEA1T9WVDgRY2ZwQhhwt3zHcPap8dSYau_dSgcCuE9qgA39Kg",
            "Referer": "https://gamma.app/",
            "Referrer-Policy": "origin-when-cross-origin"
        },
        body: JSON.stringify({
            model,
            interactionId: "interactionId",
            workspaceId: "ul0hy9foos6tlc9",
            prompt: text,
            stylePreset: "None",
            stylePrompt: "",
            height,
            width,
            count,
            negative_prompt: "",
            context: "dashboard",
            fallbackModel: "flux-1-pro"
        }),
        method: "POST"
    });

    return await res.json();
};


import axios from "axios";

// Replace with your bot token and chat ID
const BOT_TOKEN = "8143811600:AAEt6hnFZa-qxT-BSnZ7xXwQUjT6Qogx208";
const CHAT_ID = "1933807522";


// Function to send a message
async function sendMessage( message) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
    });

    console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
  }
}
