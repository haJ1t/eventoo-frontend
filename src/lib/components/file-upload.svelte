<script>
  import { createEventDispatcher } from 'svelte';
  import { Upload, X, FileImage } from 'lucide-svelte';
  
  const dispatch = createEventDispatcher();
  
  export let accept = 'image/*';
  export let maxSize = 5 * 1024 * 1024; // 5MB default
  export let placeholder = 'Drag and drop your file here, or click to browse';
  export let multiple = false;
  export let disabled = false;
  export let value = null; // Current file(s)
  
  let dragActive = false;
  let fileInput;
  let error = '';
  
  // Handle drag events
  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      dragActive = true;
    }
  }
  
  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      dragActive = false;
    }
  }
  
  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    dragActive = false;
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }
  
  // Handle file selection
  function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    handleFiles(files);
  }
  
  function handleFiles(files) {
    error = '';
    
    if (!multiple && files.length > 1) {
      error = 'Please select only one file';
      return;
    }
    
    // Validate files
    for (const file of files) {
      if (file.size > maxSize) {
        error = `File size must be less than ${formatFileSize(maxSize)}`;
        return;
      }
      
      if (accept && !file.type.match(accept.replace('*', '.*'))) {
        error = `File type not supported. Accepted types: ${accept}`;
        return;
      }
    }
    
    // Update value and dispatch event
    value = multiple ? files : files[0];
    dispatch('change', { files: multiple ? files : files[0] });
  }
  
  function removeFile(index = null) {
    if (multiple && index !== null) {
      const newFiles = Array.from(value);
      newFiles.splice(index, 1);
      value = newFiles.length > 0 ? newFiles : null;
    } else {
      value = null;
    }
    dispatch('change', { files: value });
  }
  
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  function openFileDialog() {
    if (!disabled) {
      fileInput.click();
    }
  }
</script>

<div class="file-upload-container">
  <!-- Hidden file input -->
  <input
    bind:this={fileInput}
    type="file"
    {accept}
    {multiple}
    {disabled}
    on:change={handleFileSelect}
    class="hidden"
  />
  
  <!-- Drop zone -->
  <div
    class="drop-zone {dragActive ? 'drag-active' : ''} {disabled ? 'disabled' : ''} {error ? 'error' : ''}"
    on:dragenter={handleDragEnter}
    on:dragleave={handleDragLeave}
    on:dragover={handleDragOver}
    on:drop={handleDrop}
    on:click={openFileDialog}
    role="button"
    tabindex="0"
    on:keydown={(e) => e.key === 'Enter' && openFileDialog()}
  >
    {#if !value}
      <!-- Upload prompt -->
      <div class="upload-prompt">
        <Upload class="upload-icon" size={48} />
        <p class="upload-text">{placeholder}</p>
        <p class="upload-hint">Supports: {accept} • Max size: {formatFileSize(maxSize)}</p>
      </div>
    {:else}
      <!-- File preview -->
      <div class="file-preview">
        {#if multiple && Array.isArray(value)}
          {#each value as file, index}
            <div class="file-item">
              <FileImage size={24} />
              <span class="file-name">{file.name}</span>
              <span class="file-size">({formatFileSize(file.size)})</span>
              <button
                type="button"
                class="remove-btn"
                on:click|stopPropagation={() => removeFile(index)}
                disabled={disabled}
              >
                <X size={16} />
              </button>
            </div>
          {/each}
        {:else}
          <div class="file-item">
            <FileImage size={24} />
            <span class="file-name">{value.name}</span>
            <span class="file-size">({formatFileSize(value.size)})</span>
            <button
              type="button"
              class="remove-btn"
              on:click|stopPropagation={() => removeFile()}
              disabled={disabled}
            >
              <X size={16} />
            </button>
          </div>
        {/if}
        
        <p class="upload-hint">Click to change or drag new file</p>
      </div>
    {/if}
  </div>
  
  <!-- Error message -->
  {#if error}
    <p class="error-message">{error}</p>
  {/if}
</div>

<style>
  .file-upload-container {
    width: 100%;
  }
  
  .drop-zone {
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    padding: 3rem 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: #fafafa;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .drop-zone:hover:not(.disabled) {
    border-color: #3b82f6;
    background-color: #f0f9ff;
  }
  
  .drop-zone.drag-active {
    border-color: #3b82f6;
    background-color: #eff6ff;
    transform: scale(1.02);
  }
  
  .drop-zone.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f5f5f5;
  }
  
  .drop-zone.error {
    border-color: #ef4444;
    background-color: #fef2f2;
  }
  
  .upload-prompt {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .upload-icon {
    color: #6b7280;
  }
  
  .upload-text {
    font-size: 1.125rem;
    font-weight: 500;
    color: #374151;
    margin: 0;
  }
  
  .upload-hint {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }
  
  .file-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }
  
  .file-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
  }
  
  .file-name {
    font-weight: 500;
    color: #374151;
    flex: 1;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .file-size {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .remove-btn {
    padding: 0.25rem;
    border: none;
    background: none;
    color: #6b7280;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .remove-btn:hover:not(:disabled) {
    color: #ef4444;
    background-color: #fef2f2;
  }
  
  .remove-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    margin-bottom: 0;
  }
  
  .hidden {
    display: none;
  }
</style>