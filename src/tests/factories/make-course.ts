import { db } from "../../database/client.ts";
import { courses } from "../../database/schema.ts";
import { fakerPT_BR as faker } from '@faker-js/faker'

export async function makeCourse(title?: string) {
  const result = await db.insert(courses).values({
    title: title ?? faker.lorem.words(4),
  }).returning()

  return result[0]
}