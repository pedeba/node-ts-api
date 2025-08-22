ALTER TABLE "enrollments" RENAME COLUMN "course" TO "courseId";--> statement-breakpoint
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_course_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_courseId_courses_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;