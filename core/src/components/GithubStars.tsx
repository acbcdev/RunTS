import { useEffect, useState } from "react";
import { GithubIcon, Star } from 'lucide-react'
import { useEditorStore } from "@core/store/editor";
export function GithubStars() {
  const [stars, setStars] = useState<number | string>('loading...')
  const { getCurrentTheme } = useEditorStore();
  const currentTheme = getCurrentTheme();
  useEffect(() => {
    fetch('https://api.github.com/repos/acbcdev/runts').then(res => res.json()).then(data => setStars(data.stargazers_count)).catch(err => setStars('error fetching stars'))
  }, [])
  return (
    <a href="https://github.com/acbcdev/RunTS" target="_blank" rel="noreferrer" >

      <div className="flex items-center gap-1 rounded-lg p-1 text-zinc-100" style={{
        border: `1px solid ${currentTheme.ui.border}`,
        color: currentTheme.ui.foreground
      }}>

        <GithubIcon className="size-8" />
        <p  >
          Github Start <span className="font-bold" style={{
            color: currentTheme.ui.success
          }}>{stars}</span>
        </p>
        <Star style={
          { color: currentTheme.ui.accent }
        } />

      </div >
    </a>

  );
}
