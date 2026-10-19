'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Eye, 
  Edit3, 
  Heading1, 
  Heading2, 
  Heading3, 
  Minus,
  Type,
  Highlighter,
  Undo2,
  Redo2,
  RemoveFormatting
} from 'lucide-react';
import RichArticleBody, { markdownToHtml } from './RichArticleBody';

interface NewsBodyEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  rows?: number;
  placeholder?: string;
  required?: boolean;
}

export default function NewsBodyEditor({
  value,
  onChange,
  label = 'Story Content (समाचार विवरण) *',
  rows = 8,
  placeholder = 'यहाँ खबर का संपूर्ण विवरण लिखें (Write the full news story details)...',
  required = true,
}: NewsBodyEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);

  // Active toolbar formatting states (live synced with cursor)
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isBullet, setIsBullet] = useState(false);
  const [isNumbered, setIsNumbered] = useState(false);
  const [currentBlock, setCurrentBlock] = useState('p');

  const editorRef = useRef<HTMLDivElement>(null);
  const isTypingRef = useRef(false);

  // Sync value from parent into contentEditable only when not typing internally
  useEffect(() => {
    if (editorRef.current) {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        return;
      }
      const initialHtml = markdownToHtml(value || '');
      if (editorRef.current.innerHTML !== initialHtml) {
        editorRef.current.innerHTML = initialHtml;
      }
    }
  }, [value]);

  // Query formatting states at current caret position or selection
  const updateActiveStates = useCallback(() => {
    if (typeof document === 'undefined') return;
    try {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
      setIsBullet(document.queryCommandState('insertUnorderedList'));
      setIsNumbered(document.queryCommandState('insertOrderedList'));
      const block = (document.queryCommandValue('formatBlock') || 'p').toLowerCase();
      setCurrentBlock(block);
    } catch {}
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      isTypingRef.current = true;
      const html = editorRef.current.innerHTML;
      onChange(html);
      updateActiveStates();
    }
  };

  /**
   * Focus editor and ensure caret exists so that document.execCommand
   * works both when text is selected AND when clicking Bold before typing.
   */
  const ensureEditorFocus = () => {
    if (typeof window === 'undefined' || !editorRef.current) return;
    editorRef.current.focus();

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !editorRef.current.contains(sel.anchorNode)) {
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false); // Place cursor at the end
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  const executeCommand = (cmd: string, val: string | undefined = undefined) => {
    if (typeof document === 'undefined') return;
    ensureEditorFocus();
    document.execCommand(cmd, false, val);
    handleInput();
    // Schedule check right after DOM mutation
    setTimeout(updateActiveStates, 10);
  };

  const handleFormatBlock = (tag: string) => {
    executeCommand('formatBlock', tag);
    setShowFontSizeMenu(false);
  };

  const insertDivider = () => {
    executeCommand('insertHorizontalRule');
  };

  const handleHighlight = () => {
    if (typeof document === 'undefined') return;
    ensureEditorFocus();
    const current = document.queryCommandValue('hiliteColor');
    if (current && current !== 'rgba(0, 0, 0, 0)' && current !== 'transparent') {
      document.execCommand('hiliteColor', false, 'transparent');
    } else {
      document.execCommand('hiliteColor', false, '#fef08a');
    }
    handleInput();
    setTimeout(updateActiveStates, 10);
  };

  // Word and character count statistics
  const plainText = typeof window !== 'undefined' && editorRef.current
    ? (editorRef.current.innerText || '')
    : value.replace(/<[^>]*>/g, '');
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const charCount = plainText.length;

  return (
    <div className="space-y-1.5 w-full">
      {/* Top Header with Label & Edit/Preview Tab switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
          {label}
        </label>
        
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">
            {wordCount} शब्द | {charCount} अक्षर
          </span>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>लिखें (Editor)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>प्रीव्यू (Preview)</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'edit' ? (
        <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500/40 focus-within:border-amber-600 bg-white dark:bg-slate-900 shadow-xs">
          
          {/* VISUAL WYSIWYG FORMATTING TOOLBAR */}
          <div className="bg-slate-50 dark:bg-slate-800/80 px-2.5 py-2 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-1 sm:gap-1.5 text-slate-700 dark:text-slate-200 select-none">
            
            {/* Font Size & Heading Dropdown */}
            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setShowFontSizeMenu(!showFontSizeMenu);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold transition shadow-2xs border cursor-pointer ${
                  currentBlock === 'h1' || currentBlock === 'h2' || currentBlock === 'h3'
                    ? 'bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-100 text-slate-800 dark:text-slate-100'
                }`}
                title="शीर्षक एवं फॉन्ट साइज़ चुनें"
              >
                <Type className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {currentBlock === 'h2' ? 'मुख्य शीर्षक (H2)' : currentBlock === 'h3' ? 'उप-शीर्षक (H3)' : currentBlock === 'h1' ? 'बड़ा शीर्षक (H1)' : 'फॉन्ट साइज़'}
                </span>
                <span className="text-[10px] text-slate-400">▼</span>
              </button>

              {showFontSizeMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowFontSizeMenu(false)} 
                  />
                  <div className="absolute left-0 top-full mt-1 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                      शीर्षक एवं आकार (Heading & Size)
                    </div>
                    
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormatBlock('<h2>');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-sm font-black text-amber-700 dark:text-amber-400">मुख्य शीर्षक (H2)</span>
                      <span className="text-[10px] text-slate-400">22px Bold</span>
                    </button>

                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormatBlock('<h3>');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-xs font-extrabold text-red-600">उप-शीर्षक (H3)</span>
                      <span className="text-[10px] text-slate-400">18px Bold</span>
                    </button>

                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormatBlock('<h1>');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-base font-black">बड़ा शीर्षक (H1)</span>
                      <span className="text-[10px] text-slate-400">26px</span>
                    </button>

                    <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormatBlock('<p>');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center justify-between cursor-pointer"
                    >
                      <span>सामान्य पैराग्राफ (Normal)</span>
                      <span className="text-[10px] text-slate-400">14px</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-0.5" />

            {/* BOLD BUTTON (Visual WYSIWYG) */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand('bold');
              }}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 font-bold text-xs ${
                isBold
                  ? 'bg-amber-600 text-white shadow-inner ring-2 ring-amber-500 font-black'
                  : 'hover:bg-amber-100 dark:hover:bg-amber-950/50 hover:text-amber-800 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
              title="बोल्ड करें / बोल्ड में लिखें (Ctrl+B)"
            >
              <Bold className="w-4 h-4 stroke-[3]" />
              <span className="font-extrabold">बोल्ड</span>
            </button>

            {/* ITALIC BUTTON */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand('italic');
              }}
              className={`p-1.5 rounded-md transition cursor-pointer flex items-center justify-center ${
                isItalic
                  ? 'bg-amber-600 text-white font-black shadow-inner ring-1 ring-amber-700'
                  : 'hover:bg-amber-100 dark:hover:bg-amber-950/50 hover:text-amber-800 text-slate-700 dark:text-slate-200'
              }`}
              title="इटैलिक / तिरछा करें (Ctrl+I)"
            >
              <Italic className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* UNDERLINE BUTTON */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand('underline');
              }}
              className={`p-1.5 rounded-md transition cursor-pointer flex items-center justify-center ${
                isUnderline
                  ? 'bg-amber-600 text-white font-black shadow-inner ring-1 ring-amber-700'
                  : 'hover:bg-amber-100 dark:hover:bg-amber-950/50 hover:text-amber-800 text-slate-700 dark:text-slate-200'
              }`}
              title="अंडरलाइन करें (Ctrl+U)"
            >
              <Underline className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-0.5" />

            {/* QUICK HEADING H2 */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleFormatBlock(currentBlock === 'h2' ? '<p>' : '<h2>');
              }}
              className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-0.5 transition cursor-pointer ${
                currentBlock === 'h2'
                  ? 'bg-amber-600 text-white shadow-inner'
                  : 'hover:bg-amber-100 dark:hover:bg-amber-950/50 hover:text-amber-800 text-slate-700 dark:text-slate-200'
              }`}
              title="मुख्य शीर्षक (H2 - 22px Bold)"
            >
              <Heading2 className="w-4 h-4 text-amber-600 group-hover:text-amber-800" />
              <span className="text-[11px] font-black">H2</span>
            </button>

            {/* QUICK HEADING H3 */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleFormatBlock(currentBlock === 'h3' ? '<p>' : '<h3>');
              }}
              className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-0.5 transition cursor-pointer ${
                currentBlock === 'h3'
                  ? 'bg-red-600 text-white shadow-inner'
                  : 'hover:bg-amber-100 dark:hover:bg-amber-950/50 hover:text-amber-800 text-slate-700 dark:text-slate-200'
              }`}
              title="उप-शीर्षक (H3 - 18px Bold)"
            >
              <Heading3 className="w-4 h-4 text-red-600" />
              <span className="text-[11px] font-black">H3</span>
            </button>

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-0.5" />

            {/* BULLET LIST */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand('insertUnorderedList');
              }}
              className={`p-1.5 rounded-md transition cursor-pointer flex items-center justify-center ${
                isBullet
                  ? 'bg-amber-600 text-white font-black shadow-inner'
                  : 'hover:bg-amber-100 dark:hover:bg-amber-950/50 hover:text-amber-800 text-slate-700 dark:text-slate-200'
              }`}
              title="बुलेट सूची (• Bullet points)"
            >
              <List className="w-4 h-4" />
            </button>

            {/* NUMBERED LIST */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand('insertOrderedList');
              }}
              className={`p-1.5 rounded-md transition cursor-pointer flex items-center justify-center ${
                isNumbered
                  ? 'bg-amber-600 text-white font-black shadow-inner'
                  : 'hover:bg-amber-100 dark:hover:bg-amber-950/50 hover:text-amber-800 text-slate-700 dark:text-slate-200'
              }`}
              title="संख्या सूची (1. 2. 3. Numbered list)"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            {/* QUOTE / CALLOUT */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleFormatBlock(currentBlock === 'blockquote' ? '<p>' : '<blockquote>');
              }}
              className="p-1.5 rounded-md hover:bg-amber-100 dark:hover:bg-amber-950/50 hover:text-amber-800 transition text-slate-700 dark:text-slate-200 cursor-pointer"
              title="हाइलाइट कोटेशन बॉक्स (Quote)"
            >
              <Quote className="w-4 h-4" />
            </button>

            {/* DIVIDER */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                insertDivider();
              }}
              className="p-1.5 rounded-md hover:bg-amber-100 dark:hover:bg-amber-950/50 hover:text-amber-800 transition text-slate-700 dark:text-slate-200 cursor-pointer"
              title="विभाजक रेखा (Divider line)"
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* HIGHLIGHT */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleHighlight();
              }}
              className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200 transition flex items-center gap-1 cursor-pointer"
              title="पीले रंग से हाइलाइट करें"
            >
              <Highlighter className="w-3.5 h-3.5 text-amber-600" />
              <span>हाइलाइट</span>
            </button>

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-0.5" />

            {/* UNDO / REDO */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand('undo');
              }}
              className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="पूर्ववत करें (Undo - Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand('redo');
              }}
              className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="फिर से करें (Redo - Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>

            {/* CLEAR FORMATTING */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand('removeFormat');
              }}
              className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-red-600 transition cursor-pointer"
              title="फॉर्मेटिंग हटाएं (Clear Formatting)"
            >
              <RemoveFormatting className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CONTENT EDITABLE VISUAL CONTAINER */}
          <div
            ref={editorRef}
            contentEditable={true}
            suppressContentEditableWarning={true}
            onInput={handleInput}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
                setTimeout(updateActiveStates, 10);
              }
            }}
            onKeyUp={updateActiveStates}
            onMouseUp={updateActiveStates}
            onSelect={updateActiveStates}
            data-placeholder={placeholder}
            style={{ minHeight: `${rows * 26}px` }}
            className="w-full p-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-base font-sans focus:outline-none leading-relaxed overflow-y-auto max-h-[460px] visual-news-editor empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
          />

          {/* Quick Helper Tips at Bottom */}
          <div className="bg-slate-50 dark:bg-slate-800/40 px-3 py-1.5 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded text-[10px]">
                WYSIWYG लाइव
              </span>
              टेक्स्ट सेलेक्ट करके <b>B (बोल्ड)</b> दबाएँ या पहले <b>B</b> दबाकर सीधे बोल्ड में लिखें।
            </span>
            <span className="text-[10px] text-slate-400">
              शीर्षक के लिए <b>H2/H3</b> चुनें • <b>Ctrl+B</b> सपोर्टेड
            </span>
          </div>
        </div>
      ) : (
        /* LIVE PREVIEW CONTAINER */
        <div className="border border-amber-300 dark:border-amber-800/60 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                लाइव प्रीव्यू (Live Preview) — वेबसाइट पर पाठकों को ऐसा दिखेगा:
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>वापस संपादन करें</span>
            </button>
          </div>

          {value.trim() ? (
            <RichArticleBody content={value} />
          ) : (
            <p className="text-xs text-slate-400 italic text-center py-8">
              यहाँ कुछ लिखें, फिर उसका प्रीव्यू देखें...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
