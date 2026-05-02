import supabase from '../config/database.js';
import bcrypt from 'bcryptjs';

// Helper functions
function generateEmail(index) {
  const variations = [
    `user${index}@example.com`,
    `user.${index}@example.com`,
    `user${index}@pixelry.com`,
  ];
  return variations[index % variations.length];
}

function generateUsername(index, firstName, lastName) {
  const usernames = [
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${index}`,
    `${firstName.toLowerCase()}${index}`,
    `creative_${firstName.toLowerCase()}${index % 100}`,
    `${lastName.toLowerCase()}_${firstName.toLowerCase()}`,
  ];
  return usernames[index % usernames.length];
}

function generateBio() {
  const bios = [
    'Photography enthusiast and creative explorer',
    'Passionate about design and visual storytelling',
    'Travel lover capturing beautiful moments',
    'Food photography and culinary inspiration',
    'Fashion forward and trendsetter',
    'Nature lover and outdoor adventurer',
    'Digital artist and creative thinker',
    'Architect of beautiful spaces and designs',
    'Inspired by life and creativity',
    'Collector of beautiful ideas and moments',
    'Visual artist sharing my perspective',
    'Creating magic with every image',
    'Beauty in simplicity is my philosophy',
    'Exploring the world through my lens',
    'Bringing ideas to life visually',
  ];
  return bios[Math.floor(Math.random() * bios.length)];
}

function generateFirstName() {
  const names = [
    'Emma', 'James', 'Olivia', 'Michael', 'Sophia', 'David', 'Isabella', 'Robert',
    'Ava', 'William', 'Mia', 'Richard', 'Charlotte', 'Joseph', 'Amelia', 'Thomas',
    'Harper', 'Charles', 'Evelyn', 'Christopher', 'Alice', 'Daniel', 'Abigail', 'Matthew',
    'Ella', 'Andrew', 'Scarlett', 'Kenneth', 'Grace', 'George', 'Chloe', 'Edward',
    'Lily', 'Brian', 'Zoey', 'Ronald', 'Penelope', 'Anthony', 'Layla', 'Frank',
    'Victoria', 'Ryan', 'Sofia', 'Gary', 'Eleanor', 'Nicholas', 'Hannah', 'Eric',
  ];
  return names[Math.floor(Math.random() * names.length)];
}

function generateLastName() {
  const names = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
    'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Young',
    'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Peterson', 'Phillips', 'Campbell',
    'Parker', 'Evans', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales',
  ];
  return names[Math.floor(Math.random() * names.length)];
}

function generatePinTitle() {
  const adjectives = ['Beautiful', 'Stunning', 'Gorgeous', 'Amazing', 'Incredible', 'Awesome', 'Perfect', 'Magical', 'Creative', 'Inspiring'];
  const nouns = ['Sunset', 'Landscape', 'Design', 'Artwork', 'Creation', 'Moment', 'Scene', 'Vision', 'Inspiration', 'Collection'];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
}

function generatePinDescription() {
  const descriptions = [
    'A stunning visual capturing the essence of creativity and beauty.',
    'This piece represents inspiration and artistic vision.',
    'An amazing creation that showcases talent and dedication.',
    'Inspired by nature and modern aesthetics.',
    'A perfect blend of tradition and innovation.',
    'This image tells a unique story of beauty and wonder.',
    'Created with passion and attention to detail.',
    'A beautiful moment frozen in time.',
    'Artistic expression at its finest.',
    'Capturing the magic of everyday moments.',
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getRandomCategory() {
  const categories = ['photography', 'design', 'travel', 'food', 'art', 'fashion', 'nature', 'architecture'];
  return categories[Math.floor(Math.random() * categories.length)];
}

function getRandomDate(monthsBack = 6) {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * monthsBack * 30 * 24 * 60 * 60 * 1000);
  return pastDate.toISOString();
}

// Main seed function
async function seed() {
  try {
    console.log('🌱 Starting database seeding...\n');

    const TOTAL_USERS = 100;
    const PINS_PER_USER = 4; // 3-5 pins per user

    // ============ STEP 1: Generate and insert users ============
    console.log(`📝 Generating ${TOTAL_USERS} users...`);
    const users = [];

    for (let i = 1; i <= TOTAL_USERS; i++) {
      const firstName = generateFirstName();
      const lastName = generateLastName();
      const email = generateEmail(i);
      const username = generateUsername(i, firstName, lastName);
      const passwordHash = await bcrypt.hash('password123', 12);
      const avatarUrl = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=d97706&color=fff&size=200`;

      users.push({
        email,
        username,
        first_name: firstName,
        last_name: lastName,
        password_hash: passwordHash,  // ✅ CORRECT - matches schema
        avatar_url: avatarUrl,
        bio: generateBio(),
        created_at: getRandomDate(),
      });
    }

    // Insert users into database
    console.log(`⬆️  Inserting ${TOTAL_USERS} users into database...`);
    const { data: insertedUsers, error: userError } = await supabase
      .from('users')
      .insert(users)
      .select('id, email, username');

    if (userError) {
      console.error('❌ Error inserting users:', userError.message);
      throw userError;
    }

    console.log(`✅ Successfully inserted ${insertedUsers.length} users\n`);

    // ============ STEP 2: Generate and insert pins ============
    console.log(`📌 Generating ${TOTAL_USERS * PINS_PER_USER} pins...`);
    const pins = [];

    for (let i = 0; i < insertedUsers.length; i++) {
      const userId = insertedUsers[i].id;
      const pinsPerUser = Math.floor(Math.random() * 3) + 3; // 3-5 pins

      for (let j = 1; j <= pinsPerUser; j++) {
        const imageNumber = i * PINS_PER_USER + j + Math.floor(Math.random() * 1000);
        pins.push({
          user_id: userId,
          title: generatePinTitle(),
          description: generatePinDescription(),
          image_url: `https://picsum.photos/400/500?random=${imageNumber}`,
          category: getRandomCategory(),
          created_at: getRandomDate(),
        });
      }
    }

    console.log(`⬆️  Inserting ${pins.length} pins into database...`);
    const { data: insertedPins, error: pinError } = await supabase
      .from('pins')
      .insert(pins)
      .select('id, user_id');

    if (pinError) {
      console.error('❌ Error inserting pins:', pinError.message);
      throw pinError;
    }

    console.log(`✅ Successfully inserted ${insertedPins.length} pins\n`);

    // ============ STEP 3: Generate random likes ============
    console.log(`❤️  Generating random pin likes...`);
    const likes = [];
    const likePercentage = 0.25; // 25% of users like pins
    const pinsPerUserToLike = 8; // Average pins to like

    for (let i = 0; i < insertedUsers.length; i++) {
      if (Math.random() < likePercentage) {
        const userId = insertedUsers[i].id;

        for (let j = 0; j < pinsPerUserToLike; j++) {
          const randomPin = insertedPins[Math.floor(Math.random() * insertedPins.length)];
          
          // Avoid liking own pins
          if (randomPin.user_id !== userId) {
            likes.push({
              pin_id: randomPin.id,
              user_id: userId,
              created_at: getRandomDate(),
            });
          }
        }
      }
    }

    // Remove duplicates
    const uniqueLikes = Array.from(
      new Map(likes.map((like) => [`${like.pin_id}-${like.user_id}`, like])).values()
    );

    if (uniqueLikes.length > 0) {
      console.log(`⬆️  Inserting ${uniqueLikes.length} likes...`);
      const { error: likeError } = await supabase.from('pin_likes').insert(uniqueLikes);

      if (likeError && !likeError.message.includes('duplicate')) {
        console.error('⚠️  Warning: Some likes could not be inserted:', likeError.message);
      } else {
        console.log(`✅ Successfully inserted ${uniqueLikes.length} likes`);
      }
    }
    console.log();

    // ============ STEP 4: Generate random saves ============
    console.log(`🔖 Generating random pin saves...`);
    const saves = [];
    const savePercentage = 0.2; // 20% of users save pins
    const pinsPerUserToSave = 6; // Average pins to save

    for (let i = 0; i < insertedUsers.length; i++) {
      if (Math.random() < savePercentage) {
        const userId = insertedUsers[i].id;

        for (let j = 0; j < pinsPerUserToSave; j++) {
          const randomPin = insertedPins[Math.floor(Math.random() * insertedPins.length)];
          
          // Avoid saving own pins
          if (randomPin.user_id !== userId) {
            saves.push({
              pin_id: randomPin.id,
              user_id: userId,
              created_at: getRandomDate(),
            });
          }
        }
      }
    }

    // Remove duplicates
    const uniqueSaves = Array.from(
      new Map(saves.map((save) => [`${save.pin_id}-${save.user_id}`, save])).values()
    );

    if (uniqueSaves.length > 0) {
      console.log(`⬆️  Inserting ${uniqueSaves.length} saves...`);
      const { error: saveError } = await supabase.from('pin_saves').insert(uniqueSaves);

      if (saveError && !saveError.message.includes('duplicate')) {
        console.error('⚠️  Warning: Some saves could not be inserted:', saveError.message);
      } else {
        console.log(`✅ Successfully inserted ${uniqueSaves.length} saves`);
      }
    }
    console.log();

    // ============ STEP 5: Generate random follows ============
    console.log(`👥 Generating random user follows...`);
    const follows = [];
    const followsPerUser = 12; // Each user follows ~12 others

    for (let i = 0; i < insertedUsers.length; i++) {
      const userId = insertedUsers[i].id;
      const followCount = Math.floor(Math.random() * 8) + 5; // 5-12 follows

      for (let j = 0; j < followCount; j++) {
        const randomIndex = Math.floor(Math.random() * insertedUsers.length);
        const followedUserId = insertedUsers[randomIndex].id;

        // Avoid following self
        if (userId !== followedUserId) {
          follows.push({
            follower_id: userId,
            following_id: followedUserId,
            created_at: getRandomDate(),
          });
        }
      }
    }

    // Remove duplicates
    const uniqueFollows = Array.from(
      new Map(follows.map((follow) => [`${follow.follower_id}-${follow.following_id}`, follow])).values()
    );

    if (uniqueFollows.length > 0) {
      console.log(`⬆️  Inserting ${uniqueFollows.length} follows...`);
      const { error: followError } = await supabase.from('user_follows').insert(uniqueFollows);

      if (followError && !followError.message.includes('duplicate')) {
        console.error('⚠️  Warning: Some follows could not be inserted:', followError.message);
      } else {
        console.log(`✅ Successfully inserted ${uniqueFollows.length} follows`);
      }
    }
    console.log();

    // ============ SUMMARY ============
    console.log('═══════════════════════════════════════');
    console.log('✅ SEEDING COMPLETED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════');
    console.log(`📊 Summary:`);
    console.log(`   • Users: ${insertedUsers.length}`);
    console.log(`   • Pins: ${insertedPins.length}`);
    console.log(`   • Likes: ${uniqueLikes.length}`);
    console.log(`   • Saves: ${uniqueSaves.length}`);
    console.log(`   • Follows: ${uniqueFollows.length}`);
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run the seed
seed();
