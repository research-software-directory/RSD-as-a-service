# Page 3

Hopefully that looks good enough to you.

### What about nested lists?

Nested lists basically always look bad which is why editors like Medium don't even let you do it, but I guess since some of you goofballs are going to do it we have to carry the burden of at least making it work.

1. **Nested lists are rarely a good idea.**
- You might feel like you are being really "organized" or something but you are just creating a gross shape on the screen that is hard to read.
- Nested navigation in UIs is a bad idea too, keep things as flat as possible.
- Nesting tons of folders in your source code is also not helpful.
2. **Since we need to have more items, here's another one.**
- I'm not sure if we'll bother styling more than two levels deep.
- Two is already too much, three is guaranteed to be a bad idea.
- If you nest four levels deep you belong in prison.
3. **Two items isn't really a list, three is good though.**
- Again please don't nest lists if you want people to actually read your content.
- Nobody wants to look at this.
- I'm upset that we even have to bother styling this.

The most annoying thing about lists in Markdown is that `<li>` elements aren't given a child `<p>` tag unless there are multiple paragraphs in the list item. That means I have to worry about styling that annoying situation too.

- **For example, here's another nested list.**

  But this time with a second paragraph.

  - These list items won't have `<p>` tags
  - Because they are only one line each

- **But in this second top-level list item, they will.**

  This is especially annoying because of the spacing on this paragraph.

  - As you can see here, because I've added a second line, this list item now has a `<p>` tag.

    This is the second line I'm talking about by the way.

  - Finally here's another list item so it's more like a list.

- A closing list item, but with no nested list, because why not?

And finally a sentence to close off this section.
