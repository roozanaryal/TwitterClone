# Ad Banner Admin Panel

This admin panel allows you to control the ad banner that appears on your Twitter clone application.

## Features

- **Toggle Ad Banner**: Enable/disable the ad banner completely
- **Customize Content**: Change title, subtitle, description, and pricing
- **Update Images**: Change product image and logo text
- **Styling Options**: Modify background colors and text colors
- **Timing Controls**: Adjust when the banner appears and when users can close it
- **CTA Management**: Update call-to-action button text and URL
- **Reset to Default**: Restore original Toyota Camry ad settings

## Setup Instructions

### 1. Create Admin User

First, create an admin user by running the setup script:

```bash
cd backend
node scripts/createAdmin.js
```

This will create an admin user with:
- **Username**: admin
- **Password**: admin123
- **Email**: admin@example.com

### 2. Start the Application

Make sure both backend and frontend are running:

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 3. Access Admin Panel

1. Login to the application using the admin credentials
2. Navigate to `/admin` in your browser
3. You should see the Ad Banner Admin Panel

## Default Behavior

- If the backend doesn't send any ad banner configuration, the AdBanner component will use the default Toyota Camry ad
- The ad banner appears after 20 seconds by default
- Users can close the banner after 5 seconds
- The banner is active by default

## API Endpoints

- `GET /api/ad-banner` - Get current ad banner configuration (public)
- `PUT /api/ad-banner/update` - Update ad banner settings (admin only)
- `POST /api/ad-banner/reset` - Reset to default values (admin only)

## Admin Panel Fields

### Basic Information
- **Title**: Main headline of the ad
- **Subtitle**: Secondary text
- **Description**: Additional details
- **Price**: Pricing information
- **Logo Text**: Text displayed in the logo circle

### URLs
- **Image URL**: Product image URL
- **CTA URL**: Where the call-to-action button links

### Styling
- **Background Gradient**: Choose from predefined Tailwind gradient classes
- **Text Color**: Set the text color

### Timing
- **Show Delay**: How long to wait before showing the banner (seconds)
- **Close Button Delay**: How long users must wait before they can close the banner (seconds)

## Security

- Admin routes are protected by authentication middleware
- Only users with `isAdmin: true` can access admin functions
- Regular users can only view the ad banner, not modify it

## Troubleshooting

1. **Can't access admin panel**: Make sure you're logged in with an admin account
2. **Changes not appearing**: Check browser console for API errors
3. **Default ad showing**: This is expected behavior when no custom configuration exists
