import { VercelRequest, VercelResponse } from '@vercel/node'
import { Octokit } from "octokit";
import collectionPromise from './mongodb-client';

const octokit = new Octokit();

// Main function export
export default async (req: VercelRequest, res: VercelResponse) => {
  const ts = Date.now();
  // Get releases from github
  const assets = (await octokit.rest.repos.listReleases({
    owner: 'vercel',
    repo: 'hyper'
  })).data.map(release => {
    return release.assets.map(asset => {
      const {uploader, ...data} = asset;
      return {
        ...data,
        ts,
        release: release.name
      }
    });
  }).flat();

  res.send(`<pre>${JSON.stringify(assets, null, 2)}</pre>`);

  // Push to db    
  const collection = await collectionPromise;
  await collection.insertMany(assets);

  return;
}
