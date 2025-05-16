import { MastraClient } from "@mastra/client-js";
import { useAudioRecorder, useAudioPlayer , AudioModule, RecordingPresets, useAudioPlayerStatus, AudioPlayer } from 'expo-audio';

class Mastra {
  private client;
  private agent;
  private audioRecorder;

  constructor() {
    this.client = new MastraClient({ baseUrl: "http://172.20.10.4:4111" });
    this.agent = this.client.getAgent("emergencyorchestrator");
  }

  getAgent() {
    return this.agent;
  }

  getDetails() {
    return this.agent.details()
  }

  async voiceInput(blob: Blob) {
    const agent = this.getAgent();
    const transcript = await agent.voice.listen(require("@/assets/audio/greeting.mp3"), {
      filetype: "mp3",
    })
    console.log("Here")
    console.log(transcript)
  }

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
//   baseUrl: "http://172.20.10.4:4111", // Default Mastra development server port
// });
// const agent = client.getAgent("emergencyorchestrator");