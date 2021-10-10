import { VercelRequest, VercelResponse } from '@vercel/node'
import { Octokit } from "octokit";
import collectionPromise from './mongodb-client';

const octokit = new Octokit();

// Main function export
export default async (req: VercelRequest, res: VercelResponse) => {
  // Get releases from github
  const releases = (await octokit.rest.repos.listReleases({
    owner: 'vercel',
    repo: 'hyper'
  })).data.map(release => {
    const ts = Date.now();
    return {
      ...release,
      ts,
      assets: release.assets.map(asset => {
        return {
          ...asset,
          ts
        }
      })
    }
  });

  res.json(releases);

  // Push to db    
  const collection = await collectionPromise;
  await collection.insertOne(releases);

  return;
}
