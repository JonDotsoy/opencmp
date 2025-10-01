import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Paths
const sourceFile = join(process.cwd(), 'src/components/ui/cookies-manager.tsx');
const targetFile = join(process.cwd(), 'public/cookies-manager.json');

try {
  // Read the source TSX file content
  const sourceContent = readFileSync(sourceFile, 'utf-8');
  
  // Read the existing JSON file
  const jsonContent = readFileSync(targetFile, 'utf-8');
  const jsonData = JSON.parse(jsonContent);
  
  // Update the content property of the first file
  if (jsonData.files && jsonData.files[0]) {
    jsonData.files[0].content = sourceContent;
    
    // Write the updated JSON back to file
    writeFileSync(targetFile, JSON.stringify(jsonData, null, 2), 'utf-8');
    
    console.log('✅ Successfully updated public/cookies-manager.json with content from src/components/ui/cookies-manager.tsx');
  } else {
    console.error('❌ Error: files[0] not found in the JSON structure');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error processing files:', error);
  process.exit(1);
}