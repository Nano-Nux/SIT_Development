# Image galleries and homepage video

From `university_backend`, apply the additive gallery schema update and regenerate the client:

```sh
npx prisma db push
npx prisma generate
```

Restart the backend after generating the client. On Windows, stop the backend first if Prisma reports a locked query engine.

For installations managed with SQL, `20261006_image_galleries.sql` adds only the two gallery columns. Run `npx prisma generate` afterward.

News and campus facilities accept an ordered `imageUrls` array. Its first image becomes `imageUrl`, preserving cover images in existing cards. Sending an empty array removes all images; omitting the array preserves the existing gallery. Existing records with just `imageUrl` continue to display that image.

In the admin dashboard, News Articles and Campus Facilities support multiple image selection, drag and drop, removal, and reordering. Public galleries support horizontal scrolling, swiping, arrow buttons, and arrow keys.

In Hero Sections → Homepage Hero, upload an MP4/WebM video (up to 50 MB) or enter a direct video file URL, then save. The existing `Hero.bgVideoUrl` field stores the video. It autoplays muted, loops, and plays inline on mobile. The player automatically uses the video's first frame; no poster URL is needed. Other page heroes retain their image editors. To remove the old homepage poster value from existing records, run `20261006_remove_home_hero_poster.sql`.
