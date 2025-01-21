import { useEffect, useState } from "react";
import { GithubIcon, Star } from 'lucide-react'
import { useEditorStore } from "@/store/editor";
export function GithubStars() {
  const [stars, setStars] = useState<number | string>('...')
  const { getCurrentTheme } = useEditorStore();
  const currentTheme = getCurrentTheme();
  useEffect(() => {
    fetch('https://api.github.com/repos/acbcdev/runts').then(res => res.json()).then(data => setStars(data.stargazers_count)).catch(() => setStars('Error Fetching'))
  }, [])
  return (
    <a href="https://github.com/acbcdev/RunTS" target="_blank" rel="noreferrer" >

      <div className="flex items-center gap-1 p-1 rounded-lg text-zinc-100" style={{
        border: `1px solid ${currentTheme.ui.border}`,
        color: currentTheme.ui.foreground
      }}>

        <GithubIcon className="size-6" />
        <p  >
          Github Starts <span className="text-lg font-bold" style={{
            color: currentTheme.ui.success
          }}>{stars}</span>
        </p>
        <Star className="size-6" style={
          { color: currentTheme.ui.accent }
        } />

      </div >
    </a>

  );
}
