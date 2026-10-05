<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Segmentation logic lives in src/lib/model.ts (fixed centroids, nearest-centroid inference) so all pages share one deterministic model.
- Last analyzed user is shared across pages via React context in src/lib/store.tsx so the pages act as one system.
