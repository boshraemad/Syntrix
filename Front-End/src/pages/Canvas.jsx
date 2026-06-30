import React, { useState, useEffect, useRef } from 'react';
import { FiEdit3, FiSearch, FiTrash2, FiClock } from 'react-icons/fi';
import { 
  ChevronDown, List, ListOrdered, CheckSquare, 
  Type, Heading1, Heading2, Heading3, Heading4, Code as CodeBlockIcon, Quote,
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Link as LinkIcon,
  AlignLeft, AlignCenter, AlignRight, MoreHorizontal,
  Baseline, X, Paperclip
} from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';

const TEXT_COLORS = [
  { name: 'Default', color: '' },
  { name: 'Gray', color: '#9b9a97' },
  { name: 'Brown', color: '#937264' },
  { name: 'Orange', color: '#ffa344' },
  { name: 'Yellow', color: '#ffdc49' },
  { name: 'Green', color: '#4dab9a' },
  { name: 'Blue', color: '#529cca' },
  { name: 'Purple', color: '#9a6dd7' },
  { name: 'Pink', color: '#e255a1' },
  { name: 'Red', color: '#ff7369' }
];

const HIGHLIGHT_COLORS = [
  { name: 'Default background', color: '' },
  { name: 'Gray background', color: '#454b4e' },
  { name: 'Brown background', color: '#434040' },
  { name: 'Orange background', color: '#594a3a' },
  { name: 'Yellow background', color: '#59563b' },
  { name: 'Green background', color: '#354c4b' },
  { name: 'Blue background', color: '#364954' },
  { name: 'Purple background', color: '#443f57' },
  { name: 'Pink background', color: '#533b4c' },
  { name: 'Red background', color: '#594141' }
];

export default function Canvas() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('syntrix_canvas_notes');
    if (savedNotes) return JSON.parse(savedNotes);
    return [{
      id: Date.now().toString(),
      title: 'Welcome to Canvas',
      content: '<p>This is your minimal workspace for taking notes, writing documentation, and saving incident reports.</p><p>Highlight text to see the advanced <strong>Notion-style</strong> toolbar!</p>',
      updatedAt: Date.now()
    }];
  });

  const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Link popover state
  const [linkUrl, setLinkUrl] = useState('');
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        editor.chain().focus().setImage({ src: event.target.result }).run();
      };
      reader.readAsDataURL(file);
    } else {
      const tempUrl = URL.createObjectURL(file);
      editor.chain().focus().insertContent(` <a href="${tempUrl}" download="${file.name}">📎 ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</a> `).run();
    }
    
    e.target.value = '';
  };

  useEffect(() => {
    localStorage.setItem('syntrix_canvas_notes', JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleCreateNote = () => {
    const newNote = { id: Date.now().toString(), title: 'Untitled Note', content: '<p></p>', updatedAt: Date.now() };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleUpdateNote = (id, field, value) => {
    setNotes(prevNotes => prevNotes.map(note => note.id === id ? { ...note, [field]: value, updatedAt: Date.now() } : note));
  };

  const handleDeleteNote = (id, e) => {
    e.stopPropagation();
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    if (activeNoteId === id) setActiveNoteId(newNotes[0]?.id || null);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: { HTMLAttributes: { class: 'bg-[#1a1a1a] p-3 rounded-md font-mono text-sm border border-white/5' } },
        blockquote: { HTMLAttributes: { class: 'border-l-4 border-gray-500 pl-4 italic text-gray-400 my-4' } }
      }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      Image,
    ],
    content: activeNote ? activeNote.content : '',
    onUpdate: ({ editor }) => {
      if (activeNoteId) handleUpdateNote(activeNoteId, 'content', editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert focus:outline-none text-white text-base leading-relaxed font-sans max-w-none tiptap-canvas min-h-[500px]',
      },
    },
  });

  useEffect(() => {
    if (editor && activeNote) {
      const currentEditorContent = editor.getHTML();
      if (currentEditorContent !== activeNote.content) {
        editor.commands.setContent(activeNote.content);
      }
    }
  }, [activeNoteId, editor]);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActiveTurnInto = () => {
    if (editor?.isActive('heading', { level: 1 })) return 'Heading 1';
    if (editor?.isActive('heading', { level: 2 })) return 'Heading 2';
    if (editor?.isActive('heading', { level: 3 })) return 'Heading 3';
    if (editor?.isActive('heading', { level: 4 })) return 'Heading 4';
    if (editor?.isActive('codeBlock')) return 'Code block';
    if (editor?.isActive('blockquote')) return 'Quote';
    return 'Text';
  };

  const getActiveListIcon = () => {
    if (editor?.isActive('orderedList')) return <ListOrdered size={16} />;
    if (editor?.isActive('taskList')) return <CheckSquare size={16} />;
    return <List size={16} />;
  };

  const handleLinkSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (linkUrl.trim() === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
      } else {
        let finalUrl = linkUrl.trim();
        if (!/^https?:\/\//i.test(finalUrl) && !/^mailto:/i.test(finalUrl)) {
          finalUrl = `https://${finalUrl}`;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run();
      }
      setIsLinkPopoverOpen(false);
      setLinkUrl('');
    }
  };

  const openLinkMenu = () => {
    const previousUrl = editor.getAttributes('link').href;
    setLinkUrl(previousUrl || '');
    setIsLinkPopoverOpen(true);
  };

  // Popover components for reusability
  const MenuPopover = ({ trigger, children, width = 'w-48', open, onOpenChange }) => (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content 
          sideOffset={8} 
          className={`z-50 ${width} bg-[#252525] border border-cyan-500/20 rounded-lg shadow-[0_0_20px_rgba(56,189,248,0.1)] p-1 text-sm text-white animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95`}
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );

  const MenuItem = ({ icon: Icon, label, shortcut, active, onClick, color }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-white/10 transition-colors ${active ? 'bg-white/5 text-white' : 'text-gray-300'}`}
    >
      <div className="flex items-center gap-2">
        {color ? (
          <div className="w-5 h-5 rounded-sm flex items-center justify-center font-serif text-[11px] font-bold" style={{ backgroundColor: color || 'transparent', color: color ? '#fff' : '#fff', border: color ? 'none' : '1px solid rgba(56,189,248,0.3)' }}>
            A
          </div>
        ) : (
          Icon && <Icon size={14} className={active ? 'text-white' : 'text-gray-400'} />
        )}
        <span>{label}</span>
      </div>
      {shortcut && <span className="text-xs text-gray-500 font-mono tracking-tighter">{shortcut}</span>}
    </button>
  );

  return (
    <div className="flex flex-1 h-full bg-[#050505] text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-white/5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold tracking-wide text-sm">Canvas Notes</span>
            <button onClick={handleCreateNote} className="text-gray-400 hover:text-white transition-colors"><FiEdit3 size={18} /></button>
          </div>
          <div className="relative flex items-center">
            <FiSearch className="absolute left-3 text-gray-500" size={14} />
            <input 
              type="text" placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111] border border-purple-500/20 rounded-md py-1.5 pl-9 pr-8 text-sm focus:outline-none focus:border-cyan-400/50 focus:shadow-[0_0_10px_rgba(56,189,248,0.2)] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 p-1 text-gray-500 hover:text-white transition-colors rounded-sm hover:bg-white/10"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNotes.length === 0 ? (
            <div className="text-center text-xs text-gray-600 mt-4">No notes found.</div>
          ) : (
            filteredNotes.sort((a, b) => b.updatedAt - a.updatedAt).map(note => (
              <div 
                key={note.id} onClick={() => setActiveNoteId(note.id)}
                className={`p-3 rounded-md cursor-pointer transition-all group flex flex-col gap-1 border border-transparent ${activeNoteId === note.id ? 'bg-purple-500/20 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'hover:bg-[#111] hover:border-white/5'}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium truncate pr-2 ${activeNoteId === note.id ? 'text-white' : 'text-gray-300'}`}>{note.title || 'Untitled Note'}</span>
                  <button onClick={(e) => handleDeleteNote(note.id, e)} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity"><FiTrash2 size={14} /></button>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono"><FiClock size={10} />{new Date(note.updatedAt).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 overflow-y-auto h-full relative custom-scrollbar">
        {activeNote ? (
          <div className="max-w-[900px] w-full mx-auto px-12 py-16 flex flex-col gap-6 min-h-full">
            <input 
              type="text" value={activeNote.title} onChange={(e) => handleUpdateNote(activeNote.id, 'title', e.target.value)}
              placeholder="Note Title" className="w-full bg-transparent text-4xl font-bold text-white placeholder-gray-600 focus:outline-none"
            />
            
            {editor && (
              <BubbleMenu editor={editor} tippyOptions={{ duration: 100, maxWidth: 800 }} className="flex items-center bg-[hsl(0,0%,3%)]/80 backdrop-blur-xl border border-cyan-500/20 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(56,189,248,0.1)] p-1.5 gap-0.5 text-gray-300 transition-all">
                
                {/* 1. List Menu */}
                <MenuPopover trigger={
                  <button className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-white/10 hover:text-white transition-all text-sm">
                    {getActiveListIcon()} <ChevronDown size={14} className="opacity-50" />
                  </button>
                }>
                  <div className="text-xs font-semibold text-gray-500 px-2 py-1">Lists</div>
                  <MenuItem icon={List} label="Bulleted list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
                  <MenuItem icon={ListOrdered} label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
                  <MenuItem icon={CheckSquare} label="Task list" active={editor.isActive('taskList')} onClick={() => editor.chain().focus().toggleTaskList().run()} />
                </MenuPopover>

                <div className="w-px h-5 bg-white/10 mx-1" />

                {/* 2. Turn Into Menu */}
                <MenuPopover width="w-56" trigger={
                  <button className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-white/10 hover:text-white transition-all text-sm font-medium">
                    {getActiveTurnInto()} <ChevronDown size={14} className="opacity-50" />
                  </button>
                }>
                  <div className="text-xs font-semibold text-gray-500 px-2 py-1">Turn Into</div>
                  <MenuItem icon={Type} label="Text" shortcut="AltCtrl0" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()} />
                  <MenuItem icon={Heading1} label="Heading 1" shortcut="AltCtrl1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
                  <MenuItem icon={Heading2} label="Heading 2" shortcut="AltCtrl2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
                  <MenuItem icon={Heading3} label="Heading 3" shortcut="AltCtrl3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
                  <MenuItem icon={Heading4} label="Heading 4" shortcut="AltCtrl4" active={editor.isActive('heading', { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} />
                  <MenuItem icon={CodeBlockIcon} label="Code block" shortcut="AltCtrlC" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} />
                  <MenuItem icon={Quote} label="Quote" shortcut="AltCtrlQ" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
                </MenuPopover>

                <div className="w-px h-5 bg-white/10 mx-1" />

                {/* 3. Colors (A) */}
                <MenuPopover width="w-48" trigger={
                  <button className={`p-2 rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 transition-all ${editor.isActive('textStyle') || editor.isActive('highlight') ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]' : ''}`}>
                    <Baseline size={16} />
                  </button>
                }>
                  <div className="max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
                    <div className="text-xs font-semibold text-gray-500 px-2 py-1">Color</div>
                    {TEXT_COLORS.map(c => (
                      <MenuItem 
                        key={c.name} 
                        color={c.color} 
                        label={c.name} 
                        active={editor.isActive('textStyle', { color: c.color })} 
                        onClick={() => c.color ? editor.chain().focus().setColor(c.color).run() : editor.chain().focus().unsetColor().run()} 
                      />
                    ))}
                    <div className="w-full h-px bg-white/10 my-1" />
                    <div className="text-xs font-semibold text-gray-500 px-2 py-1">Background</div>
                    {HIGHLIGHT_COLORS.map(c => (
                      <MenuItem 
                        key={c.name} 
                        color={c.color} 
                        label={c.name} 
                        active={editor.isActive('highlight', { color: c.color })} 
                        onClick={() => c.color ? editor.chain().focus().setHighlight({ color: c.color }).run() : editor.chain().focus().unsetHighlight().run()} 
                      />
                    ))}
                  </div>
                </MenuPopover>

                <div className="w-px h-5 bg-white/10 mx-1" />

                {/* 4. Formatting (B, I, U, S, Code) */}
                <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 transition-all ${editor.isActive('bold') ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]' : ''}`}><Bold size={16} strokeWidth={3} /></button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 transition-all ${editor.isActive('italic') ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]' : ''}`}><Italic size={16} strokeWidth={3} /></button>
                <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 transition-all ${editor.isActive('underline') ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]' : ''}`}><UnderlineIcon size={16} strokeWidth={3} /></button>
                <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-2 rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 transition-all ${editor.isActive('strike') ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]' : ''}`}><Strikethrough size={16} strokeWidth={3} /></button>
                <button onClick={() => editor.chain().focus().toggleCode().run()} className={`p-2 rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 transition-all ${editor.isActive('code') ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]' : ''}`}><Code size={16} strokeWidth={3} /></button>

                <div className="w-px h-5 bg-white/10 mx-1" />

                {/* 5. Align Menu */}
                <MenuPopover trigger={
                  <button className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-white/10 hover:text-white transition-all text-sm">
                    <AlignLeft size={16} /> <ChevronDown size={14} className="opacity-50" />
                  </button>
                }>
                  <MenuItem icon={AlignLeft} label="Align left" shortcut="CtrlShiftL" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} />
                  <MenuItem icon={AlignCenter} label="Align center" shortcut="CtrlShiftE" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} />
                  <MenuItem icon={AlignRight} label="Align right" shortcut="CtrlShiftR" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} />
                </MenuPopover>

                <div className="w-px h-5 bg-white/10 mx-1" />

                {/* 6. Link with Input Popover */}
                <MenuPopover width="w-64" open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen} trigger={
                  <button onClick={openLinkMenu} className={`p-2 rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 transition-all ${editor.isActive('link') ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]' : ''}`}>
                    <LinkIcon size={16} />
                  </button>
                }>
                  <div className="flex items-center gap-2 p-1 relative">
                    <input 
                      type="text" 
                      placeholder="Paste a link then press enter" 
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      onKeyDown={handleLinkSubmit}
                      autoFocus
                      className="w-full bg-transparent border-none text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-0 py-1 px-2"
                    />
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <button onClick={() => setIsLinkPopoverOpen(false)} className="p-1 hover:bg-white/10 rounded-sm transition-colors text-gray-400 hover:text-white">
                      <X size={14} />
                    </button>
                  </div>
                </MenuPopover>

                {/* 7. File Upload (Frontend Only) */}
                <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 transition-all ml-1">
                  <Paperclip size={16} />
                </button>
              </BubbleMenu>
            )}

            <div className="flex-1 w-full pb-32">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <EditorContent editor={editor} className="h-full" />
            </div>
            
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600 flex-col gap-4">
            <FiEdit3 size={48} className="opacity-20" />
            <p>Select a note or create a new one to start writing.</p>
          </div>
        )}
      </div>

    </div>
  );
}
