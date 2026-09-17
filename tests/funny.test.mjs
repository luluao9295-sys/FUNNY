import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGenerationInput, extractVideoUrl, isValidRequestId } from '../lib/funny.mjs';

test('buildGenerationInput creates a vertical Seedance request with style direction', () => {
  const result = buildGenerationInput('Un kebab sauve le monde', 'Drôle');
  assert.equal(result.endpoint, 'bytedance/seedance-2.5/text-to-video');
  assert.equal(result.input.aspect_ratio, '9:16');
  assert.equal(result.input.duration, 5);
  assert.equal(result.input.resolution, '720p');
  assert.equal(result.input.output_format, 'mp4');
  assert.equal(result.input.generate_audio, true);
  assert.match(result.input.prompt, /Un kebab sauve le monde/);
  assert.match(result.input.prompt, /comédie visuelle/i);
});

test('extractVideoUrl reads completed Higgsfield response', () => {
  assert.equal(extractVideoUrl({ video: { url: 'https://cdn.example/video.mp4' } }), 'https://cdn.example/video.mp4');
  assert.equal(extractVideoUrl({ jobs: [{ results: { raw: { url: 'https://cdn.example/sdk.mp4' } } }] }), 'https://cdn.example/sdk.mp4');
  assert.equal(extractVideoUrl({ status: 'queued' }), null);
});

test('isValidRequestId only accepts UUID request ids', () => {
  assert.equal(isValidRequestId('d7e6c0f3-6699-4f6c-bb45-2ad7fd9158ff'), true);
  assert.equal(isValidRequestId('../admin'), false);
});
