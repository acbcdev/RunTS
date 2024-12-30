import { useChat } from 'ai/react'
import { Textarea } from '../ui/textarea';
export function Chat() {
  const { messages, input, setInput, isLoading, handleSubmit, error } = useChat({ api: 'api/chat', })
  return (
    <div>
      {error && <p>{error.name}</p>}
      {error && <p>{error.message}</p>}
      {error && <p>{error.stack}</p>}

      {messages.map((message, i) => (<div key={message.id}>
        {message.role === 'user' ? 'User: ' : 'AI: '}
        <p>{message.content}</p>
      </div>))}
      <Textarea disabled={isLoading} className='fixed bottom-0 right-0 left-0' value={input} onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleSubmit()
        }
      }} onChange={(e) => setInput(e.target.value)} />
    </div>
  );
}