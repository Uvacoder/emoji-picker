import React from 'react';
import Emoji from './Emoji';

export default function EmojiCategory({ name, emojis, onCopy, showModifiers }) {
  return (
      <div>
        {emojis.map(emoji => (
          <Emoji
            emoji={emoji}
            showModifiers={showModifiers}
            key={emoji.modifier ? `${emoji.emoji}-${emoji.modifier}` : emoji.emoji}
            onCopy={onCopy} />
        ))}
      </div>
  );
}
