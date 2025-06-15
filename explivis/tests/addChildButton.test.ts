import { describe, it, expect, vi } from 'vitest';
import { chartHandler, edges, nodes } from '../src/stores'
import { get } from 'svelte/store';
import { render, fireEvent } from '@testing-library/svelte';
import AddChildButton from '../src/Components/Buttons/AddChildButton.svelte'

describe('Add Child Button', () => {
    it('Should add node and edge when calling addChildChart', async () => {
        chartHandler.addNewChart()
        let startNumberOfNodes = get(nodes).length
        let startNumberOfEdges = get(edges).length


        chartHandler.addChildChart("0", {x: 100, y: 100})

        let newNumberOfNodes = get(nodes).length
        expect(newNumberOfNodes).toBe(startNumberOfNodes + 1)
        let newNumberOfEdges = get(edges).length
        expect(newNumberOfEdges).toBe(startNumberOfEdges + 1)
        let newEdge = get(edges).slice(-1)[0]
        expect(newEdge.id).toBe("0-1")
    })

    it('Should call addChildChart when button is clicked', async () => {
        const chartHandlerNewChartSpy = vi.spyOn(chartHandler, 'addChildChart').mockImplementation(() => {});
        const { getByRole } = render(AddChildButton, {props: {id: 0}})

        // Get the button and simulate a click
        const button = getByRole('button')
        await fireEvent.click(button)

        
        expect(chartHandlerNewChartSpy).toHaveBeenCalledTimes(1)

    })
})