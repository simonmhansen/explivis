import { describe, it, expect, vi } from 'vitest';
import { chartHandler, edges, nodes, pythonEditorVisible } from '../src/stores'
import { get } from 'svelte/store';
import { render, fireEvent } from '@testing-library/svelte';

import HidePythonEditorButton from '../src/Components/Buttons/HidePythonEditorButton.svelte'

describe('Hide Python Editor Button', () => {
    it('Should toggle pythonEditorVisible store when clicked', async () => {
        let startVisible = get(pythonEditorVisible)

        const { getByRole } = render(HidePythonEditorButton)

        // Get the button and simulate a click
        const button = getByRole('button')
        await fireEvent.click(button)

        let newVisible = get(pythonEditorVisible)
        expect(newVisible).toBe(!startVisible)
    })

})