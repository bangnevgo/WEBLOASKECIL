import ZAI from 'z-ai-web-dev-sdk';

async function testZAI() {
  try {
    console.log('Creating ZAI instance...');
    const zai = await ZAI.create();
    console.log('ZAI instance created:', !!zai);
    
    console.log('Making chat completion request...');
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'user', content: 'Say hello in Indonesian' }
      ],
      thinking: { type: 'disabled' }
    });
    
    console.log('Response:', JSON.stringify(completion, null, 2));
    const message = completion.choices[0]?.message?.content;
    console.log('Message content:', message);
  } catch (error) {
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testZAI();
