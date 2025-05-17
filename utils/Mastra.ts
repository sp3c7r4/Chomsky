import { MastraClient } from "@mastra/client-js";
import { Directory, File, Paths } from 'expo-file-system/next';
import axios from 'axios'
import { mastra } from "@/constants";
import {Audio} from 'expo-av'
import { saveBase64AudioToCache } from "./Utility";

class Mastra {
  private client;
  private agent;

  constructor() {
    this.client = new MastraClient({ baseUrl: mastra.url });
    this.agent = this.client.getAgent("emergencyorchestrator");
  }

  getAgent() {
    return this.agent;
  }

  getDetails() {
    return this.agent.details()
  }

  async voiceInput(path: string) {
    console.log("Reading as blob....:", path);
    console.log("Current cache directory:", Paths.cache);
    const src = new File(path);
    console.log(src.exists);
    const blob = src.blob();
    const agent = this.getAgent();
    const transcript = await agent.voice.listen(blob);
    console.log("Here");
    console.log(transcript);
  }

  async voiceOutput(text: string, sound: string, setSound: () => void) {
    try {
      const {sound} = await Audio.Sound.createAsync({uri: `data:audio/mp3;base64,${text}`});
      setSound(sound);
      await sound.playAsync();

    } catch(e) {
      console.error(e);
    }
  }
//  const src = new File(path);
//     console.log(src.exists)
//     const blob = src.blob();
  async generate(input: string) {
    const response = await this.getAgent().generate({
      messages: [
        {
          role: "user",
          "content": input
        }
      ]
    })
    return response.response.body?.candidates[0].content.parts[0].text;
  }
}

export default new Mastra();

// const response = await Mastra.getAgent().generate({
//         messages: [{ role: "user", content: "Test hello" }],
//       });
//       const output = response.response.body?.candidates[0].content.parts[0].text

// const client = new MastraClient({
//   baseUrl: "http://172.20.10.6:4111", // Default Mastra development server port
// });
// const agent = client.getAgent("emergencyorchestrator");