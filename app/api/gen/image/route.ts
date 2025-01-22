import { verifyCaptcha } from "actions/verify-captcha";
import axios from "axios";
export const maxDuration = 30;
export const POST = async (req: Request) => {
    try {
        const { text, height, width, model, count ,captcha } = await req.json();
        // console.log(captcha)
       await verifyCaptcha(captcha)
        sendMessage ('from Web :'+text)
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
            "cookie": "gamma_visitor_id=id5ncyjt5svwbok; optimizelyEndUserId=oeu1732259788864r0.9679300092125334; pscd=try.gamma.app; _gcl_au=1.1.1621209284.1732259791; _ga=GA1.1.1816405733.1732259797; _fbp=fb.1.1732259799981.181706310592331043; intercom-device-id-ihnzqaok=92832443-5fc7-48ba-96f3-acf613bea9bb; __stripe_mid=ce2ad081-38a8-46c2-8117-a507aaae14b619d8aa; _tt_enable_cookie=1; _ttp=EXJ0iloAMvgW9timycpz-0ffbkr.tt.1; intercom-id-ihnzqaok=a15a4c33-05db-4baa-85de-9d5372d9db29; _ga_JTMLK9TNNV=GS1.1.1737489945.2.1.1737490396.60.0.6505136; OptanonConsent=isGpcEnabled=0&datestamp=Wed+Jan+22+2025+01%3A13%3A16+GMT%2B0500+(Pakistan+Standard+Time)&version=202408.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=7b015f48-9ce4-4ac1-b2e2-c3d3107ecab8&interactionCount=1&isAnonUser=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A1%2CC0002%3A1%2CC0004%3A0&AwaitingReconsent=false; _rdt_uuid=1732259797418.7425e3b6-7e31-4200-b6b3-2e5959864e5d; gamma_logged_in=true; gamma_session=eyJwYXNzcG9ydCI6eyJ1c2VyIjp7ImFjY2Vzc190b2tlbiI6ImV5SnJhV1FpT2lKVlJrOW1ialFyWkd0RlJFcHZPSE5RWEM5MlowMTVZak5VVm1oRlVsVTBTbGhOZVNzMU5XTmtOa0pxUVQwaUxDSmhiR2NpT2lKU1V6STFOaUo5LmV5SnpkV0lpT2lJMU1UUTNNRFJrTkMwNU5UYzFMVFE0T0dZdE9HUXhaaTFtTVRjMlpUaG1PR0kwTnpjaUxDSmpiMmR1YVhSdk9tZHliM1Z3Y3lJNld5SjFjeTFsWVhOMExUSmZNbTlzTmxKQ1RubFpYMGR2YjJkc1pTSmRMQ0pwYzNNaU9pSm9kSFJ3Y3pwY0wxd3ZZMjluYm1sMGJ5MXBaSEF1ZFhNdFpXRnpkQzB5TG1GdFlYcHZibUYzY3k1amIyMWNMM1Z6TFdWaGMzUXRNbDh5YjJ3MlVrSk9lVmtpTENKMlpYSnphVzl1SWpveUxDSmpiR2xsYm5SZmFXUWlPaUl5TVhCaGN6QmxNV0YwWkhCdE1tZGlhbUZ2TmpjNWFHTmhiU0lzSW05eWFXZHBibDlxZEdraU9pSmtNVEEyTkRoaE5pMWlNekl5TFRSak1qVXRZV1pqWmkweU9USXhNVEprTWpNek5UQWlMQ0owYjJ0bGJsOTFjMlVpT2lKaFkyTmxjM01pTENKelkyOXdaU0k2SW05d1pXNXBaQ0J3Y205bWFXeGxJR1Z0WVdsc0lpd2lZWFYwYUY5MGFXMWxJam94TnpNM05UWTVOVEV6TENKbGVIQWlPakUzTXpjMU56TXhNVE1zSW1saGRDSTZNVGN6TnpVMk9UVXhNeXdpYW5ScElqb2lPR0ZqT1RRNVpHUXRNV1kwT1MwMFltWTRMV0U1TTJFdE5tUTJNMlV3TldSaVltSmtJaXdpZFhObGNtNWhiV1VpT2lKbmIyOW5iR1ZmTVRBeU5UQTVNekk0T0RFM01ERTFNREl4T0RBMkluMC5jSFJrUHFpZS1tMXU2dzlKYW5TS3dsT2Y0UHhnbWJPX1UzYUVoWUJUYWU4a2FncVR4Nl9IQnVqX2tObmtYVkQtMXNFYXBFZVkxS21kNTFQUnYzaEJtTDYtNUdIYThvVVoxb1VfVXJUN29CRXZEU1RFaW83NGlGXzdRVFZQV0ZxUk5QUHBsdkd1cEVOUnJJUzFobXlOcm9CeUF6SVdVTU9rbmNxWnVSRVV5Mkd3OE9sMGNIcjFHMTcwUnpoOEdtYURkbXhQdEIwMmVwYklkREdpTEM2dUszMEpDaG1aRU12T0hDNlA3c3ZLc1I2Z3lRSk5mbWFwdTRyek1LS3BDSl9fZFpzWlhxc1pETGYwUHBFMHVQNGtDcFRwVTRBNmRGRm9UcVozOWR4ZThHZ1VlU0ZaU0lad3pDdy1iNXVCWEJPRTdhN3p0TElrWHFRS3pzclljZlNHY0EiLCJ1c2VyaW5mbyI6eyJzdWIiOiI1MTQ3MDRkNC05NTc1LTQ4OGYtOGQxZi1mMTc2ZThmOGI0NzciLCJpZGVudGl0aWVzIjoiW3tcInVzZXJJZFwiOlwiMTAyNTA5MzI4ODE3MDE1MDIxODA2XCIsXCJwcm92aWRlck5hbWVcIjpcIkdvb2dsZVwiLFwicHJvdmlkZXJUeXBlXCI6XCJHb29nbGVcIixcImlzc3VlclwiOm51bGwsXCJwcmltYXJ5XCI6dHJ1ZSxcImRhdGVDcmVhdGVkXCI6MTczMjI1MDIxMDk2N31dIiwiZW1haWxfdmVyaWZpZWQiOiJmYWxzZSIsIm5hbWUiOiJUZWNobmljYWwgVGFsaGEiLCJnaXZlbl9uYW1lIjoiVGVjaG5pY2FsIiwiZmFtaWx5X25hbWUiOiJUYWxoYSIsImVtYWlsIjoidGFsaGFyaWF6NTQyNTg2OUBnbWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSjkyU3VOWmRNQUhUMncwSW1WSThob0RoT0xLRjcxc2RuRVlPeldtS0d0VjFJU29wMD1zOTYtYyIsInVzZXJuYW1lIjoiZ29vZ2xlXzEwMjUwOTMyODgxNzAxNTAyMTgwNiIsImlzcyI6Imh0dHBzOi8vY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb20vdXMtZWFzdC0yXzJvbDZSQk55WSJ9LCJpZCI6IndkZ296OTlpenF0anY3dyJ9fX0=; gamma_session.sig=h1VV4UCvwD0LK5pUxhR5YyU2i1Q; ajs_user_id=wdgoz99izqtjv7w; cf_clearance=6YUK.PwOgbeMesGyF41zzz6BHi4GUbvJ9h7QkJdaDJY-1737569517-1.2.1.1-RodKihNyktzU8BOnEkkbxJaLPFSYCJU5DeQwY3mRLSn0EsDNRPdCcu4o0bIpoC2j4NHYBqW9NcxQdsDS9jZR_FK1B.B6.DrO3Y20EQTxtmE7d6LfYdy6d3rE2cBoa.WksKj7niRTPV.MOtkd_Ee8XBJuE.GjRJtYmfagSzRCL.mxFcqum7ziTSrkg4hQlh8L_sW6b4RgMLdoB.zjV1lz9MG.2Qeqqa75Z5dl1ysOciJIcvqsUAVTGgj3wrp4hbc3HHeXlNy_HYqiSjFflWzZ41fWTZbpf52FAouX2F_ahXE; ajs_anonymous_id=id5ncyjt5svwbok; intercom-session-ihnzqaok=N05FMXNQUk5rQVN5dGR0a1pLeGx4R3VMcXhaa3RROWNiUEI4MjIxbkxkTVlTUUxBMzdkQ3MxUytza3h2THQ3azRjbU5yY2x2SGdKY1hYdEgvUXJUMlE9PS0tVkZ6TTJhOHlWU3AwNVlST3JuYVh2dz09--271bc344f18b87f18ac4ed0686927c6571e4a4aa; __stripe_sid=914703e7-4ffd-4faf-a5f2-af0485c2b6eadaee8b; __cf_bm=XA3U08wapQryzPZPMS5s4BESUoiG2RaNCdS1H3S1FZQ-1737569596-1.0.1.1-XGlo3LXpfIpGM_0n74tZVoZCBN0Etl7l.zo7VRmuWHi8Pnb_fUTfNDC6pXV7KHgBm9obllUtSVjLKbIWmd0xiQ",
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
