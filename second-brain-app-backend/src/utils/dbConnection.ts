import mongoose from "mongoose";

export async function connection(url: string) {
  await mongoose.connect(url)
}